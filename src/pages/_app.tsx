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
        :root {
          --max-content: 800px;

          --background-strong: #fff;
          --background-weak: #eee;

          --font-heading: 800 32px "Inter", sans-serif;
          --font-heading-light: 300 32px "Inter", sans-serif;

          --font-body: 400 16px "Open Sans", sans-serif;
          --font-body-bold: 700 16px "Open Sans", sans-serif;
        }

        body {
          margin: 0;
          background: var(--background-weak);
          font: var(--font-body);
        }

        @font-face {
          font-family: "Inter";
          font-weight: 300;
          src: url(/fonts/Inter-Light.woff2) format("woff2");
        }

        @font-face {
          font-family: "Inter";
          font-weight: 800;
          src: url(/fonts/Inter-ExtraBold.woff2) format("woff2");
        }

        @font-face {
          font-family: "Open Sans";
          font-weight: 400;
          src: url(/fonts/OpenSans-Regular.woff2) format("woff2");
        }

        @font-face {
          font-family: "Open Sans";
          font-weight: 700;
          src: url(/fonts/OpenSans-Bold.woff2) format("woff2");
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
