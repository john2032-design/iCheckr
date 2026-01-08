import {useState} from "react";
import Link from "next/link";
export default function CheckCert(){
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);
  const [error,setError]=useState(null);
  async function submit(e){
    e.preventDefault();
    setResult(null); setError(null);
    const form = new FormData(e.target);
    setLoading(true);
    try{
      const fileInput = e.target.querySelector('input[name="file"]');
      if(!fileInput || !fileInput.files || !fileInput.files.length) throw new Error("P12 file is required");
      const f = fileInput.files[0];
      if(!/\.p12$/i.test(f.name)) throw new Error("Uploaded file must have .p12 extension");
      const resp = await fetch("/api/checkcert", { method: "POST", body: form });
      const json = await resp.json();
      if(!resp.ok) throw new Error(json.error || JSON.stringify(json));
      setResult(json);
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
            <div className="title">Certificate Check</div>
            <div className="subtitle">Validate P12 files and OCSP status</div>
          </div>
        </div>
      </header>
      <section className="card">
        <form onSubmit={submit}>
          <div className="form-row">
            <label>Certificate (.p12) file</label>
            <input name="file" type="file" accept=".p12,application/x-pkcs12" required />
          </div>
          <div className="form-row">
            <label>Password (required for p12)</label>
            <input name="password" type="text" required />
          </div>
          <div style={{display:"flex",gap:12}}>
            <button className="button" disabled={loading} type="submit">{loading? "Validating..." : "Validate Certificate"}</button>
            <Link href="/"><button className="small">Back</button></Link>
          </div>
        </form>
        {error && <div className="result" style={{color:"#ffb4c9"}}>{error}</div>}
        {result && <div className="result">
          <pre className="code">{JSON.stringify(result,null,2)}</pre>
        </div>}
      </section>
      <div className="footer">iCheckr • Neon UI</div>
    </main>
  )
}
