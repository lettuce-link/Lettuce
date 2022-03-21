import { useEffect, useState } from "react";

export const MIN_DESKTOP_WIDTH = 900;

// adapted from https://github.com/streamich/react-use/blob/master/src/factory/createBreakpoint.ts
export function useOnScreenWidthChange(onChange) {
  useEffect(() => {
    let previousWidth = null;

    if (typeof window === "undefined") {
      return null;
    }

    const setCurrentScreenSize = (): void => {
      const currentWidth = window.innerWidth;

      if (previousWidth !== currentWidth) {
        onChange(currentWidth);
      }

      previousWidth = currentWidth;
    };

    setCurrentScreenSize();

    window.addEventListener("resize", setCurrentScreenSize);

    return () => {
      window.removeEventListener("resize", setCurrentScreenSize);
    };
  });
}

function checkIsDesktop() {
  return (window?.innerWidth || 0) >= MIN_DESKTOP_WIDTH;
}

export function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(checkIsDesktop);

  useOnScreenWidthChange(() => setIsDesktop(checkIsDesktop()));

  return isDesktop;
}
