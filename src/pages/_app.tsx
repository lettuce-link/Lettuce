import Head from "next/head";
import { ToastProvider } from "../components/toast";
import { Theme } from "../atoms/theme";
import { Header } from "../components/header";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Header />
      <Theme />
      <ToastProvider>
        <Head>
          <title>Lettuce</title>
        </Head>
        <Component {...pageProps} />
      </ToastProvider>
    </>
  );
}
