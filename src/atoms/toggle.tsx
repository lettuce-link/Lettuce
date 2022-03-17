import { Button } from "./input";
import { InvertedMarker } from "./theme";

export function MultiStateButton({ options, currentIndex, onClick }) {
  // Options will almost never change, ok to use index as key
  return (
    <Button onClick={onClick}>
      <InvertedMarker>
        <div className="MultiStateButton-contents">
          {options.map((option, index) => (
            <StateButtonItem key={index} isSelected={currentIndex === index}>
              {option}
            </StateButtonItem>
          ))}
        </div>
      </InvertedMarker>

      <style jsx>{`
        .MultiStateButton-contents {
          display: grid;
          grid-template-columns: 1fr;
          grid-auto-rows: 32px;

          // looks about right idk
          height: 1.7em;
          box-sizing: border-box;

          position: relative;
          transition: top var(--transition-quick);
        }

        .MultiStateButton-contents {
          top: calc(${currentIndex} * -32px);
        }
      `}</style>
    </Button>
  );
}

function StateButtonItem({ isSelected, children }) {
  return (
    <div className="StateButtonItem">
      {children}

      <style jsx>{`
        .StateButtonItem {
          transition: opacity var(--transition-quick);
          opacity: ${isSelected ? "1" : "0"};
        }
      `}</style>
    </div>
  );
}
