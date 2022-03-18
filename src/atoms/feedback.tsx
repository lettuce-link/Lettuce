import { SecondaryInfo } from "./typography";

/**
 * Provides field validation feedback. If a message is provided, it will be shown as subtle advice.
 */
export function ValidationMessage({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="ValidationMessage">
      <SecondaryInfo>{message}</SecondaryInfo>
      <style jsx>{`
        .ValidationMessage {
        }
      `}</style>
    </div>
  );
}
