import { createContext, useContext } from "react";

/**
 * A wrapper that provides the app's theme in the form of CSS variables
 */
export function Theme() {
  /*
  The application relies on a few "theme invariants" – conditions that must be true for the app to not look crap.

  Any of the foreground colors:
  --foreground-strong
  --foreground-weak
  Must be legible on any of the background colors:
  --background-strong
  --background-weak

  The inverted foreground color
  --foreground-inverted
  Must be legible on dark or colored backgrounds:
  --color-primary-strong
  --color-error-strong: #f25f5c;
  --color-success-strong: #70c1b3;
  */

  // These theme variables are incomplete, but I'm trying to keep everything as minimal as possible, so new ones get added only when strictly necessary, and keeping things consistent. Pls don't just add your favorite color randomly.

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
        // Always light on dark/colored backgrounds, even in light mode
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

/**
 * A wrapper marker that sets the "isInverted" context, to let children know if they should render as light-on-dark.
 * The useIsInverted hook may be used to determine if a component is currently in an "isInverted" context.
 *
 * TODO: many elements don't support this because the inverted variant is not used much. You may have to implement it on some elements yourself (by editing said element)
 */
export function InvertedMarker({ children, inverted = true }) {
  return (
    <InvertedContext.Provider value={inverted}>
      {children}
    </InvertedContext.Provider>
  );
}

/**
 * @returns true if the component is in an inverted color context – meaning that foreground should be rendered so as to be legible on dark or colored backgrounds
 */
export const useIsInverted = (): boolean => {
  return useContext(InvertedContext);
};
