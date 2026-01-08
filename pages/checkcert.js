import {useState} from "react";
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
    <main style={{fontFamily:"Inter,system-ui,Arial",padding:24,maxWidth:900,margin:"0 auto"}}>
      <h1>Certificate Check</h1>
      <form onSubmit={submit}>
        <label>Certificate (.p12) file<br/><input name="file" type="file" accept=".p12,application/x-pkcs12" required/></label>
        <label>Password (required for p12)<br/><input name="password" type="text" required/></label>
        <div style={{marginTop:12}}>
          <button disabled={loading} type="submit">{loading? "Validating..." : "Validate Certificate"}</button>
        </div>
      </form>
      <hr/>
      {error && <div style={{color:"crimson"}}>{error}</div>}
      {result && <div>
        <h3>Result</h3>
        <pre style={{whiteSpace:"pre-wrap",background:"#f6f6f6",padding:12}}>{JSON.stringify(result,null,2)}</pre>
      </div>}
    </main>
  )
}
