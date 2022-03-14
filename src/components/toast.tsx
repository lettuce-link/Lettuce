import { createContext, useCallback, useContext, useState } from "react";
import { ErrorMessage } from "../atoms/card";
import { Column, WidthLimit } from "../atoms/layout";
import { InvertedMarker } from "../atoms/theme";
import { Info } from "../atoms/typography";

const ToastContext = createContext([]);

enum ToastType {
  Success,
  Error,
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  return (
    <ToastContext.Provider value={[toasts, setToasts]}>
      {children}
      <ToastMessages toasts={toasts} />
    </ToastContext.Provider>
  );
}

export function useShowToast() {
  const [toasts, setToasts] = useContext(ToastContext);

  const showError = useCallback(
    (message) => {
      setToasts((toasts) => [...toasts, { type: ToastType.Error, message }]);
    },
    [setToasts]
  );

  const showSuccess = useCallback(
    (message) => {
      setToasts((toasts) => [...toasts, { type: ToastType.Success, message }]);
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
      <WidthLimit>
        <Column gap="16px">
          {toasts.map(({ type, message }) => (
            <Toast type={type} message={message} />
          ))}
        </Column>
      </WidthLimit>

      <style jsx>{`
        .ToastMessages {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;

          padding: 32px 16px;
        }
      `}</style>
    </div>
  );
}

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
