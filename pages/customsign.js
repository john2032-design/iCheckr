import {useState} from "react";
export default function CustomSign(){
  const [loading,setLoading]=useState(false);
  const [result,setResult]=useState(null);
  const [error,setError]=useState(null);
  async function submit(e){
    e.preventDefault();
    setResult(null); setError(null);
    const form = new FormData(e.target);
    setLoading(true);
    try{
      const resp = await fetch("/api/customsign", { method: "POST", body: form });
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
            <div className="title">Custom Signing</div>
            <div className="subtitle">Use your .p12 and provisioning profile</div>
          </div>
        </div>
      </header>
      <section className="card">
        <form onSubmit={submit}>
          <div className="form-row">
            <label>IPA URL (optional)</label>
            <input name="ipa_url" type="url"/>
          </div>
          <div className="form-row">
            <label>Or attach IPA file (optional)</label>
            <input name="ipa" type="file" accept=".ipa,application/zip"/>
          </div>
          <div className="form-row">
            <label>Certificate (.p12) - required</label>
            <input name="cert" type="file" accept=".p12,application/x-pkcs12" required/>
          </div>
          <div className="form-row">
            <label>Provisioning Profile (.mobileprovision) - required</label>
            <input name="provision" type="file" accept=".mobileprovision,application/octet-stream" required/>
          </div>
          <div className="form-row">
            <label>Certificate Password (optional)</label>
            <input name="password" type="text"/>
          </div>
          <div style={{display:"flex",gap:12}}>
            <button className="button" disabled={loading} type="submit">{loading? "Signing..." : "Start Custom Sign"}</button>
            <button className="small" type="button" onClick={()=>{navigator.clipboard?.writeText(window.location.href)}}>Copy Page Link</button>
          </div>
        </form>
        {error && <div className="result" style={{color:"#ffb4c9"}}>{error}</div>}
        {result && <div className="result">
          <div style={{fontWeight:700,color:"white"}}>{result.appInfo?.bundleName || result.appName || "Signed App"}</div>
          <div style={{marginTop:8}}>Signing Time: {result.signingTime || result.signing_time || "N/A"}</div>
          <div style={{marginTop:8,fontWeight:700}}>Tap To Copy Paste In Browser To Install</div>
          <div style={{marginTop:6}}><code style={{color:"#a6fff8"}}>{result.itmsServicesUrl || result.itms_services_url || "N/A"}</code></div>
          <pre className="code">{JSON.stringify(result,null,2)}</pre>
        </div>}
      </section>
      <div className="footer">iCheckr • Neon UI</div>
    </main>
  )
}
