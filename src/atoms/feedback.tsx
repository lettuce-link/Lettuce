import { Advice } from "./typography";

export function ValidationMessage({ message }) {
  if (!message) {
    return null;
  }

  return (
    <div className="ValidationMessage">
      <Advice>{message}</Advice>
      <style jsx>{`
        .ValidationMessage {
        }
      `}</style>
    </div>
  );
}
