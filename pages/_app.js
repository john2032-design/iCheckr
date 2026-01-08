import Head from "next/head";
import "../styles/globals.css";
export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>iCheckr Signing</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link rel="icon" href="https://raw.githubusercontent.com/john2032-design/iCheckr/refs/heads/main/562B424C-4E28-41A0-AB8C-589C5F25D7B5.png" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}
