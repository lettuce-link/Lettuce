import {
  createContext,
  ReactChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { useTimeoutFn } from "react-use";
import { Column, WidthLimit } from "../atoms/layout";
import { InvertedMarker } from "../atoms/theme";
import { Info } from "../atoms/typography";

const ToastContext = createContext<
  [Toast[], (toasts: (t: Toast[]) => Toast[]) => void]
>([[], () => {}]);

enum ToastType {
  Success,
  Error,
}

interface Toast {
  type: ToastType;
  message: ReactChildren;
  expires: Date;
  id;
}

/**
 * Provides a component that renders toasts when they are displayed, and removes expired toasts.
 *
 * Wrap your application in this component to allow creating toasts from anywhere. (see useShowToast)
 */
export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  function clearExpired() {
    const now = new Date();
    setToasts((toasts) => toasts.filter((t) => t.expires > now));
  }

  const now = new Date();
  const nextExpiry = toasts
    // @ts-ignore bc he complains that i can't subtract dates??
    .map((t) => t.expires - now)
    .reduce((a, b) => Math.min(a, b), Infinity);

  useTimeoutFn(clearExpired, Math.max(nextExpiry, 0));

  return (
    <ToastContext.Provider value={[toasts, setToasts]}>
      {children}
      <ToastMessages toasts={toasts} />
    </ToastContext.Provider>
  );
}

function secondsFromNow(seconds: number) {
  const t = new Date();
  t.setSeconds(t.getSeconds() + 10);
  return t;
}

const DEFAULT_DURATION = 10;

let CURRENT_ID = 0;

function toast(message, type, duration) {
  return {
    message,
    type,
    expires: secondsFromNow(duration),
    id: CURRENT_ID++,
  };
}

/**
 * Returns {
 *   showError, // a function for displaying an error toast
 *   showSuccess, // a function for displaying a success toast
 * }
 * Call any of these functions once to display the desired toast.
 */
export function useShowToast() {
  const [toasts, setToasts] = useContext(ToastContext);

  const showError = useCallback(
    (message, duration = DEFAULT_DURATION) => {
      setToasts((toasts) => [
        ...toasts,
        toast(message, ToastType.Error, duration),
      ]);
    },
    [setToasts]
  );

  const showSuccess = useCallback(
    (message, duration = DEFAULT_DURATION) => {
      setToasts((toasts) => [
        ...toasts,
        toast(message, ToastType.Success, duration),
      ]);
    },
    [setToasts]
  );

  return {
    showError,
    showSuccess,
  };
}

function ToastMessages({ toasts }) {
  return (
    <div className="ToastMessages">
      <div className="ToastMessages-container">
        <WidthLimit>
          <Column gap="16px">
            {toasts.map(({ type, message, id }) => (
              <Toast key={id} type={type} message={message} />
            ))}
          </Column>
        </WidthLimit>
      </div>

      <style jsx>{`
        .ToastMessages {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
        }

        .ToastMessages-container {
          margin: 32px 16px;
        }
      `}</style>
    </div>
  );
}

/**
 * Renders a toast message.
 * A toast is a card that appears with a message, usually at the bottom of the screen, and disappears after a short delay.
 */
function Toast({ type, message }) {
  let color = "var(--background-strong)";
  let inverted = false;

  if (type === ToastType.Error) {
    inverted = true;
    color = "var(--color-error-strong)";
  } else if (type === ToastType.Success) {
    inverted = true;
    color = "var(--color-success-strong)";
  }

  return (
    <div className="Toast">
      <InvertedMarker inverted={inverted}>
        <Info>{message}</Info>
      </InvertedMarker>
      <style jsx>{`
        .Toast {
          padding: 16px;

          border-radius: var(--small-corner-round);

          background: ${color};

          box-shadow: var(--shadow-large);
          border-radius: var(--large-corner-round);
        }
      `}</style>
    </div>
  );
}
