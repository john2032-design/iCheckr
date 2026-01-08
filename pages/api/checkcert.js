import formidable from "formidable";
import FormData from "form-data";
import fs from "fs";
export const config = { api: { bodyParser: false } };
function parseForm(req){ return new Promise((res,rej)=>{ const f = formidable({ multiples:false, keepExtensions:true }); f.parse(req,(err,fields,files)=> err? rej(err) : res({fields,files})); });}
function getFilePath(f){ if(!f) return undefined; return f.filepath || f.path || f.filePath || f.tempFilePath || f.tempfilepath || undefined; }
export default async function handler(req,res){
  try{
    const {fields,files} = await parseForm(req);
    const apiKey = process.env.COCO_API_KEY;
    if(!apiKey) return res.status(500).json({error:"Server missing COCO_API_KEY"});
    const form = new FormData();
    const fileField = files && files.file;
    if(!fileField && !fields.file) return res.status(400).json({error:"Missing p12 file"});
    if(fileField){
      const path = getFilePath(fileField);
      const name = fileField.originalFilename || fileField.newFilename || "certificate.p12";
      if(!path) return res.status(500).json({error:"Uploaded p12 file path missing on server"});
      form.append("file", fs.createReadStream(path), { filename: name });
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
    if(!response.ok) return res.status(response.status).json({ status: response.status, body: parsed });
    res.status(response.status).json(parsed);
  }catch(err){
    res.status(500).json({ error: err.message || String(err) });
  }
}
