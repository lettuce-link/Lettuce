import { RevealButton } from "atoms/input";
import { Padding, Row } from "atoms/layout";
import { useBoolean } from "react-use";
import { useDomain, useIsTrusted } from "util/image";

export function SafeImage({ src }) {
  const isTrusted = useIsTrusted(src);
  const [isShown, show] = useBoolean(isTrusted);

  if (isShown) {
    return (
      <>
        <img src={src} />

        <style jsx>{`
          img {
            width: 100%;
          }
        `}</style>
      </>
    );
  }

  return <UntrustedWarning url={src} onView={show} />;
}

function UntrustedWarning({ url, onView }) {
  const domain = useDomain(url);

  return (
    <div className="UntrustedWarning">
      <Padding padding="16px">
        This image comes from an external website
        <p className="UntrustedWarning-details">
          If you view it, {domain} will know about it, and your IP address might
          be tracked
        </p>
        <Row justify="space-around">
          <RevealButton onClick={onView}>
            <Padding padding="4px 8px">Show</Padding>
          </RevealButton>
        </Row>
      </Padding>

      <style jsx>{`
        .UntrustedWarning {
          --background-color: var(--background-weak);
          --line-color: #e7e7e7;
          --line-thickness: 16px;

          background-image: linear-gradient(
            45deg,
            var(--line-color) var(--line-thickness),
            var(--background-color) var(--line-thickness),
            var(--background-color) 50%,
            var(--line-color) 50%,
            var(--line-color) calc(50% + var(--line-thickness)),
            var(--background-color) calc(50% + var(--line-thickness))
          );
          background-size: 64px 64px;

          width: 100%;
          text-align: center;
        }

        .UntrustedWarning-details {
          margin: 4px 0;
          font-size: var(--size-small);
        }
      `}</style>
    </div>
  );
}
