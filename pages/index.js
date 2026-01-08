import Link from "next/link";
export default function Home(){
  return (
    <main style={{fontFamily:"Inter,system-ui,Arial",padding:24,maxWidth:900,margin:"0 auto"}}>
      <h1>CoCoCloud Signing</h1>
      <p>Quick web UI for Free Signing, Custom Signing, and Certificate Check (Vercel-ready).</p>
      <ul>
        <li><Link href="/freesign">Free Signing</Link></li>
        <li><Link href="/customsign">Custom Signing</Link></li>
        <li><Link href="/checkcert">Certificate Check</Link></li>
      </ul>
      <hr/>
      <p>Deploy notes: set environment variable <code>COCO_API_KEY</code> in Vercel dashboard.</p>
    </main>
  )
}
