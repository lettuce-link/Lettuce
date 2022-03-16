import { createContext, useContext, useEffect, useState } from "react";

const ScrollContext = createContext<[boolean, (_: boolean) => void]>([
  false,
  (_) => {},
]);

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

export function useScrollLimit() {
  const [shouldLimit, setShouldLimit] = useContext(ScrollContext);
  useEffect(() => {
    setShouldLimit(true);

    () => {
      setShouldLimit(false);
    };
  }, [shouldLimit]);
}
