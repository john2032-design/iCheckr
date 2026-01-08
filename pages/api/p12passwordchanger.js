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
    const fileUrlField = fields.file || fields.file_url;
    if(fileField){
      const path = getFilePath(fileField);
      const name = fileField.originalFilename || fileField.newFilename || "cert.p12";
      if(!path) return res.status(500).json({error:"Uploaded p12 file path missing on server"});
      form.append("file", fs.createReadStream(path), { filename: name });
    } else if(fileUrlField){
      const url = fileUrlField.toString();
      if(!/^https?:\/\/.+\.p12(\?.*)?$/i.test(url)) return res.status(400).json({error:"file must be a valid HTTP(S) URL pointing to a .p12 file"});
      form.append("file", url);
    } else {
      return res.status(400).json({error:"Missing p12 file or URL"});
    }
    if(fields.old_password === undefined) return res.status(400).json({error:"old_password is required (use empty string if none)"});
    if(!fields.new_password) return res.status(400).json({error:"new_password is required"});
    form.append("old_password", fields.old_password);
    form.append("new_password", fields.new_password);
    const response = await fetch("https://cococloud-signing.online/api/v2/p12passwordchanger", { method: "POST", headers: { "X-API-Key": apiKey, ...form.getHeaders() }, body: form });
    const buffer = await response.arrayBuffer();
    for (const [k,v] of response.headers) res.setHeader(k, v);
    res.status(response.status).send(Buffer.from(buffer));
  }catch(err){
    res.status(500).json({ error: err.message || String(err) });
  }
}
