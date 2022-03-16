import { SecondaryInfo } from "./typography";

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
