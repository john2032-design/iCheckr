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
    <main style={{fontFamily:"Inter,system-ui,Arial",padding:24,maxWidth:900,margin:"0 auto"}}>
      <h1>Custom Signing</h1>
      <form onSubmit={submit}>
        <label>IPA URL (optional)<br/><input name="ipa_url" type="url" style={{width:"100%"}}/></label>
        <label>Or attach IPA file (optional)<br/><input name="ipa" type="file" accept=".ipa,application/zip" /></label>
        <label>Certificate (.p12) - required<br/><input name="cert" type="file" accept=".p12,application/x-pkcs12" required/></label>
        <label>Provisioning Profile (.mobileprovision) - required<br/><input name="provision" type="file" accept=".mobileprovision,application/octet-stream" required/></label>
        <label>Certificate Password (optional)<br/><input name="password" type="text" style={{width:"100%"}}/></label>
        <label>Bundle ID (optional)<br/><input name="bundleId" type="text" style={{width:"100%"}}/></label>
        <label>Bundle Name (optional)<br/><input name="bundleName" type="text" style={{width:"100%"}}/></label>
        <div style={{marginTop:12}}>
          <button disabled={loading} type="submit">{loading? "Signing..." : "Start Custom Sign"}</button>
        </div>
      </form>
      <hr/>
      {error && <div style={{color:"crimson"}}>{error}</div>}
      {result && <div>
        <h3>Result</h3>
        <p><strong>App Name:</strong> {result.appInfo?.bundleName || result.appName || "N/A"}</p>
        <p><strong>Signing Time:</strong> {result.signingTime || result.signing_time || "N/A"}</p>
        <p><strong>Tap To Copy Paste In Browser To Install</strong></p>
        <p><strong>ITMS Services URL:</strong><br/><code>{result.itmsServicesUrl || result.itms_services_url || result.itmsServices || "N/A"}</code></p>
        <pre style={{whiteSpace:"pre-wrap",background:"#f6f6f6",padding:12}}>{JSON.stringify(result,null,2)}</pre>
      </div>}
    </main>
  )
}
