import { ToastProvider } from "../components/toast";
import { Theme } from "../atoms/theme";
import { Header } from "../components/header";
import { SiteProvider } from "../api/site";
import { AuthProvider } from "../api/auth";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <SiteProvider>
        <Header />
        <Theme />
        <ToastProvider>
          <Component {...pageProps} />
        </ToastProvider>
      </SiteProvider>
    </AuthProvider>
  );
}
