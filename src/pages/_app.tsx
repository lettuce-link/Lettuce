import ClientProvider from "../lib/ClientProvider";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <WithClient>
      <Head>
        <title>Lettuce</title>
      </Head>
      <Component {...pageProps} />
      <style jsx global type="text/css">{`
        body {
          margin: 0;
        }
      `}</style>
    </WithClient>
  );
}

function WithClient({ children }) {
  // todo i don't like this... but how are we supposed to deal with SSR+WS?
  // default to the non-ws api? but then there is duplicated work...
  // or perhaps do some weird monkey patching to support ws on SSR?
  if (typeof window === "undefined") {
    // We are in SSR; doesn't support WS -> don't connect to API
    return children;
  } else {
    return <ClientProvider>{children}</ClientProvider>;
  }
}
