import formidable from "formidable";
import FormData from "form-data";
import fs from "fs";
export const config = { api: { bodyParser: false } };
function parseForm(req){ return new Promise((res,rej)=>{
  const f = formidable({ multiples:false, keepExtensions:true });
  f.parse(req,(err,fields,files)=> err? rej(err) : res({fields,files}));
});}
export default async function handler(req,res){
  try{
    const {fields,files} = await parseForm(req);
    const apiKey = process.env.COCO_API_KEY;
    if(!apiKey) return res.status(500).json({error:"Server missing COCO_API_KEY"});
    const form = new FormData();
    const fileField = files.file;
    if(!fileField && !fields.file) return res.status(400).json({error:"Missing p12 file"});
    if(fileField){
      const name = fileField.originalFilename || fileField.newFilename || "";
      if(!/\.p12$/i.test(name)) return res.status(400).json({error:"Uploaded file must have .p12 extension"});
      form.append("file", fs.createReadStream(fileField.filepath), { filename: name });
    } else {
      const fileUrl = fields.file.toString();
      if(!/^https?:\/\/.+\.(p12|pfx)(\?.*)?$/i.test(fileUrl)) return res.status(400).json({error:"file must be an HTTP(S) URL pointing to a .p12 or .pfx file"});
      form.append("file", fileUrl);
    }
    if(fields.password) form.append("password", fields.password);
    const response = await fetch("https://cococloud-signing.online/api/v2/certcheckerstatus", { method: "POST", headers: { "X-API-Key": apiKey, ...form.getHeaders() }, body: form });
    const text = await response.text();
    let parsed;
    try{ parsed = JSON.parse(text); } catch(e){ parsed = { raw: text }; }
    res.status(response.status).json(parsed);
  }catch(err){
    res.status(500).json({ error: err.message || String(err) });
  }
}
