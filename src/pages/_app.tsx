import ClientProvider from "../lib/ClientProvider";

export default function App({ Component, pageProps }) {
  if (typeof window === "undefined") {
    return <Component {...pageProps} />;
  } else {
    return (
      <ClientProvider>
        <Component {...pageProps} />
      </ClientProvider>
    );
  }
}
