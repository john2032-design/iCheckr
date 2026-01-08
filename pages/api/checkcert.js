import formidable from "formidable";
import FormData from "form-data";
import fs from "fs";
import fetch from "node-fetch";
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
    if(!files.file) return res.status(400).json({error:"Missing p12 file"});
    if(!fields.password) return res.status(400).json({error:"Missing password"});
    const form = new FormData();
    form.append("file", fs.createReadStream(files.file.filepath), { filename: files.file.originalFilename || files.file.newFilename });
    form.append("password", fields.password);
    const response = await fetch("https://cococloud-signing.online/api/v2/certcheckerstatus", { method: "POST", headers: { "X-API-Key": apiKey, ...form.getHeaders() }, body: form });
    const text = await response.text();
    let parsed;
    try{ parsed = JSON.parse(text); } catch(e){ parsed = { raw: text }; }
    res.status(response.status).json(parsed);
  }catch(err){
    res.status(500).json({ error: err.message || String(err) });
  }
}
