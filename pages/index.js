import Link from "next/link";
export default function Home(){
  return (
    <main className="container">
      <header className="header">
        <div className="logo-wrap">
          <div className="logo">
            <img src="https://raw.githubusercontent.com/john2032-design/iCheckr/refs/heads/main/562B424C-4E28-41A0-AB8C-589C5F25D7B5.png" alt="iCheckr" style={{width:46,height:46,borderRadius:8}}/>
          </div>
          <div>
            <div className="title">iCheckr Signing</div>
            <div className="subtitle">Sign iOS IPA Files · Verify P12 Certificates</div>
          </div>
        </div>
      </header>
      <nav className="nav">
        <Link href="/freesign">Free Signing</Link>
        <Link href="/customsign">Custom Signing</Link>
        <Link href="/checkcert">Certificate Check</Link>
      </nav>
      <section className="card">
        <h2 style={{color:"white",marginTop:0}}>Welcome to iCheckr</h2>
        <p style={{color:"rgba(255,255,255,0.8)"}}>Use the pages below to sign IPA files or validate P12 certificates. The UI uses neon gradient styling inspired by the app artwork.</p>
      </section>
      <section className="card">
        <h3 style={{color:"white",marginTop:0}}>Quick Links</h3>
        <ul style={{color:"rgba(255,255,255,0.78)"}}>
          <li><Link href="/freesign">Start Free Signing</Link></li>
          <li><Link href="/customsign">Start Custom Signing</Link></li>
          <li><Link href="/checkcert">Validate Certificate</Link></li>
        </ul>
      </section>
      <div className="footer">Made with ❤️ • iCheckr</div>
    </main>
  )
}
