import { createContext, useContext } from "react";

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
