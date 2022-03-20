import { noop } from "util/noop";
import { Button } from "./input";
import { InvertedMarker } from "./theme";

/**
 * A button to toggle betweeen 2 or more states
 */
export function MultiStateButton({
  options,
  currentIndex,
  onClick,
  onMouseDown = noop,
  secondary = false,
  compact = false,
}) {
  // Options will almost never change, ok to use index as key
  return (
    <Button
      secondary={secondary}
      onClick={onClick}
      onMouseDown={onMouseDown}
      compact={compact}
    >
      <InvertedMarker>
        <div className="MultiStateButton-wrapper">
          <div className="MultiStateButton-contents">
            {options.map((option, index) => (
              <StateButtonItem key={index} isSelected={currentIndex === index}>
                {option}
              </StateButtonItem>
            ))}
          </div>
        </div>
      </InvertedMarker>

      <style jsx>{`
        .MultiStateButton-wrapper {
          overflow: hidden;
        }

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
