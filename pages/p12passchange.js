import {useState} from "react";
import Link from "next/link";
export default function P12PassChange(){
  const [loading,setLoading]=useState(false);
  const [downloadUrl,setDownloadUrl]=useState(null);
  const [error,setError]=useState(null);
  async function submit(e){
    e.preventDefault();
    setDownloadUrl(null);
    setError(null);
    const form = new FormData(e.target);
    setLoading(true);
    try{
      const fileInput = e.target.querySelector('input[name="file"]');
      const fileUrl = form.get("file");
      if(fileInput && fileInput.files && fileInput.files.length){
        const f = fileInput.files[0];
        if(!/\.p12$/i.test(f.name)) throw new Error("Uploaded file must have .p12 extension");
      } else if(fileUrl && !/^https?:\/\/.+\.p12(\?.*)?$/i.test(fileUrl)){
        throw new Error("P12 URL must be an HTTP(S) URL pointing to a .p12 file");
      }
      const resp = await fetch("/api/p12passwordchanger", { method: "POST", body: form });
      if(!resp.ok){
        const json = await resp.json();
        throw new Error(json.error || JSON.stringify(json));
      }
      const blob = await resp.blob();
      const dispo = resp.headers.get("content-disposition") || "certificate_new_password.p12";
      const filenameMatch = dispo.match(/filename="?([^"]+)"?/);
      const filename = filenameMatch ? filenameMatch[1] : "certificate_new_password.p12";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setDownloadUrl("Downloaded");
    }catch(err){
      setError(err.message);
    }finally{
      setLoading(false);
    }
  }
  return (
    <main className="container">
      <header className="header">
        <div className="logo-wrap">
          <div className="logo">
            <img src="https://raw.githubusercontent.com/john2032-design/iCheckr/refs/heads/main/562B424C-4E28-41A0-AB8C-589C5F25D7B5.png" alt="iCheckr" style={{width:46,height:46,borderRadius:8}}/>
          </div>
          <div>
            <div className="title">P12 Password Change</div>
            <div className="subtitle">Change the password of a P12 file</div>
          </div>
        </div>
      </header>
      <section className="card">
        <form onSubmit={submit}>
          <div className="form-row">
            <label>P12 File (upload) or URL</label>
            <input name="file" type="file" accept=".p12,application/x-pkcs12" />
            <div style={{fontSize:12,color:"rgba(255,255,255,0.7)",marginTop:6}}>Or paste a direct HTTP(S) URL to a .p12</div>
            <input name="file_url" type="url" placeholder="https://example.com/cert.p12" />
          </div>
          <div className="form-row">
            <label>Old Password (use empty string if none)</label>
            <input name="old_password" type="text" required />
          </div>
          <div className="form-row">
            <label>New Password</label>
            <input name="new_password" type="text" required />
          </div>
          <div style={{display:"flex",gap:12}}>
            <button className="button" disabled={loading} type="submit">{loading? "Processing..." : "Change Password"}</button>
            <Link href="/"><button className="small">Back</button></Link>
          </div>
        </form>
        {error && <div className="result" style={{color:"#ffb4c9"}}>{error}</div>}
        {downloadUrl && <div className="result" style={{color:"#a6fff8"}}>File downloaded to your device</div>}
      </section>
      <div className="footer">iCheckr • Neon UI</div>
    </main>
  )
}
