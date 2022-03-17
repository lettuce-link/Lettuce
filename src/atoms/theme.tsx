import { createContext, useContext } from "react";

export function Theme() {
  return (
    <style jsx global type="text/css">{`
      :root {
        --small-content: 500px;
        --large-content: 1000px;

        --background-strong: #fff;
        --background-weak: #eee;
        --background-shade: #bbb;
        --background-transparent-dark: rgba(0, 0, 0, 0.063);

        --foreground-strong: #333;
        --foreground-weak: #777;
        // Light in dark mode, vice versa
        --foreground-inverted: #fff;

        --font-heading: 800 32px "Inter", sans-serif;
        --font-heading-light: 300 32px "Inter", sans-serif;

        --font-body: 400 16px/1.6 "Open Sans", sans-serif;
        --font-body-bold: 700 16px/1.6 "Open Sans", sans-serif;

        --size-xlarge: 32px;
        --size-large: 24px;
        --size-medium: 16px;
        --size-small: 12px;

        --size-icon: 24px;

        --small-corner-round: 4px;
        --large-corner-round: 8px;

        --color-primary-strong: #247ba0;

        --color-error-strong: #f25f5c;
        --color-success-strong: #70c1b3;

        --opacity-fade: 0.5;

        --shadow-large: 0 5px 23px 0px rgba(0, 0, 0, 0.1);
        --shadow-small: 0 2px 8px 0px rgba(0, 0, 0, 0.15);

        --transition-quick: 0.2s ease-out;
      }

      body {
        margin: 0;
        background: var(--background-weak);
        font: var(--font-body);
        color: var(--foreground-strong);
        min-height: 100vh;
      }

      h1 {
        font: var(--font-heading);
      }

      h2 {
        font: var(--font-heading-light);
      }

      svg {
        // we are rendering Remix icons with react-icons
        // for some reason, their dimensions are set to 1em
        // so, if we want them to be 24px (their intended size), we need to set the font size:
        font-size: var(--size-icon);
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
  );
}

const InvertedContext = createContext(false);

export function InvertedMarker({ children, inverted = true }) {
  return (
    <InvertedContext.Provider value={inverted}>
      {children}
    </InvertedContext.Provider>
  );
}

export const useIsInverted = (): boolean => {
  return useContext(InvertedContext);
};
