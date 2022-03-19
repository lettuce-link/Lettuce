import { createContext, useContext, useEffect, useState } from "react";

/**
 * This module exists solely because CSS is annoying, and because we want separate left-side and right-side scrollbars in the channel view.
 *
 * Apparently, for a scrollbar to work, it needs to be limited by its parent with a set height and overflow: hidden. However, we obviously don't want to limit all pages this way, because content would get hidden.
 *
 * So we let pages decide whether they want to limit the page overflow. The ones that do should just call useScrollLimit(). Once it's not called anymore, the scroll limit will be turned back off.
 */

const ScrollContext = createContext<[boolean, (_: boolean) => void]>([
  false,
  (_) => {},
]);

/**
 * Provides the shouldLimit context so that children can set it with useScrollLimit.
 *
 * When `shouldLimit` is true, limits its height to that of the parent and hides any overflow. This allows for scrolling in child components (they must set overflow: scroll or similar.)
 */
export function ScrollLimitProvider({ children }) {
  const [shouldLimit, setShouldLimit] = useState(false);

  return (
    <ScrollContext.Provider value={[shouldLimit, setShouldLimit]}>
      <div className="ScrollLimiter">
        {children}
        <style jsx>{`
          .ScrollLimiter {
            ${shouldLimit
              ? `
              height: 100%;
            overflow: hidden;
          `
              : ``}
          }
        `}</style>
      </div>
    </ScrollContext.Provider>
  );
}

/**
 * Call this to enable custom child scrollbars – see the module docs above
 */
export function useScrollLimit() {
  const [shouldLimit, setShouldLimit] = useContext(ScrollContext);
  useEffect(() => {
    setShouldLimit(true);

    return () => {
      setShouldLimit(false);
    };
  }, [shouldLimit]);
}
