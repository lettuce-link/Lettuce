import { ToastProvider } from "../components/toast";
import { Theme } from "../atoms/theme";
import { Header } from "../components/header";
import { SiteProvider } from "../api/site";
import { ClientProvider } from "../api/auth";
import { ScrollLimitProvider } from "components/scroll_limit";

/**
 * This is not a regular router page, this is "magic" for NextJS.
 * Kinda strange but go with it.
 *
 * Next will wrap all route components in the App we provide here.
 * Reference: https://nextjs.org/docs/advanced-features/custom-app
 */

export default function App({ Component, pageProps }) {
  return (
    <ClientProvider>
      <SiteProvider>
        <Theme />
        <ToastProvider>
          <AppFrame>
            <Component {...pageProps} />
          </AppFrame>
        </ToastProvider>
      </SiteProvider>
    </ClientProvider>
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
