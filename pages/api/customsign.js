import formidable from "formidable";
import FormData from "form-data";
import fs from "fs";
import {MAX_IPA_BYTES} from "./_utils";
export const config = { api: { bodyParser: false } };
function parseForm(req){ return new Promise((res,rej)=>{
  const f = formidable({ multiples:false, keepExtensions:true });
  f.parse(req,(err,fields,files)=> err? rej(err) : res({fields,files}));
});}
async function headCheckSize(sessionUrl){
  try{
    const r = await fetch(sessionUrl, { method: "HEAD", redirect:"follow" });
    if(r.ok){
      const cl = r.headers.get("content-length");
      if(cl){
        const size = parseInt(cl,10);
        if(!isNaN(size) && size > MAX_IPA_BYTES) throw new Error("Remote IPA exceeds size limit (1.10 GB).");
      }
    } else {
      const r2 = await fetch(sessionUrl, { method: "GET", headers: { Range: "bytes=0-0" }, redirect:"follow" });
      const cr = r2.headers.get("content-range") || r2.headers.get("content-length");
      if(cr && cr.includes("/")){
        const parts = cr.split("/");
        const total = parseInt(parts[1],10);
        if(!isNaN(total) && total > MAX_IPA_BYTES) throw new Error("Remote IPA exceeds size limit (1.10 GB).");
      } else if(cr){
        const size = parseInt(cr,10);
        if(!isNaN(size) && size > MAX_IPA_BYTES) throw new Error("Remote IPA exceeds size limit (1.10 GB).");
      }
    }
  }catch(e){
    return;
  }
}
export default async function handler(req,res){
  try{
    const {fields,files} = await parseForm(req);
    const apiKey = process.env.COCO_API_KEY;
    if(!apiKey) return res.status(500).json({error:"Server missing COCO_API_KEY"});
    const form = new FormData();
    const ipaUrlField = fields.ipa_url || fields.ipa;
    if(ipaUrlField){
      const ipaUrl = ipaUrlField.toString();
      if(/^https?:\/\/.+\.ipa(\?.*)?$/i.test(ipaUrl)){
        await headCheckSize(ipaUrl);
        form.append("ipa", ipaUrl);
      } else {
        return res.status(400).json({error:"ipa_url must be a valid HTTP(S) URL pointing to a .ipa file"});
      }
    }
    if(files.ipa){
      const ipa = files.ipa;
      const name = ipa.originalFilename || ipa.newFilename || "";
      if(!/\.ipa$/i.test(name)) return res.status(400).json({error:"Uploaded IPA must have .ipa extension"});
      if(ipa.size && ipa.size > MAX_IPA_BYTES) return res.status(400).json({error:"Uploaded IPA exceeds size limit (1.10 GB)."});
      form.append("ipa", fs.createReadStream(ipa.filepath), { filename: name });
    }
    if(!files.cert) return res.status(400).json({error:"Missing cert file"});
    if(!files.provision) return res.status(400).json({error:"Missing provision file"});
    form.append("cert", fs.createReadStream(files.cert.filepath), { filename: files.cert.originalFilename || files.cert.newFilename });
    form.append("provision", fs.createReadStream(files.provision.filepath), { filename: files.provision.originalFilename || files.provision.newFilename });
    if(fields.password) form.append("password", fields.password);
    if(fields.bundleId) form.append("bundleId", fields.bundleId);
    if(fields.bundleName) form.append("bundleName", fields.bundleName);
    form.append("bypassapplerevokes", "true");
    const response = await fetch("https://cococloud-signing.online/api/v2/customsign", { method: "POST", headers: { "X-API-Key": apiKey, ...form.getHeaders() }, body: form });
    const text = await response.text();
    let parsed;
    try{ parsed = JSON.parse(text); } catch(e){ parsed = { raw: text }; }
    res.status(response.status).json(parsed);
  }catch(err){
    res.status(500).json({ error: err.message || String(err) });
  }
}
