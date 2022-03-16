import { ToastProvider } from "../components/toast";
import { Theme } from "../atoms/theme";
import { Header } from "../components/header";
import { SiteProvider } from "../api/site";
import { AuthProvider } from "../api/auth";
import { ScrollLimitProvider } from "components/scroll_limit";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <SiteProvider>
        <Theme />
        <ToastProvider>
          <AppFrame>
            <Component {...pageProps} />
          </AppFrame>
        </ToastProvider>
      </SiteProvider>
    </AuthProvider>
  );
}

function AppFrame({ children }) {
  return (
    <div className="AppFrame">
      <Header />
      <ScrollLimitProvider>{children}</ScrollLimitProvider>

      <style jsx>{`
        .AppFrame {
          display: flex;
          flex-direction: column;

          height: 100vh;
        }

        .AppFrame-content {
          flex-grow: 1;
        }
      `}</style>
    </div>
  );
}
