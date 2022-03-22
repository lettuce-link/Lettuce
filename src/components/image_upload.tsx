import { useClient } from "api/auth";
import { Button, RevealButton } from "atoms/input";
import { Padding, Row } from "atoms/layout";
import { SecondaryInfo } from "atoms/typography";
import { useCallback, useState } from "react";

enum UploadState {
  Emtpy,
  Uploading,
  Uploaded,
}

export function SingleImageUpload({ onChange }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadState, setUploadState] = useState(UploadState.Emtpy);

  const client = useClient();

  const onFileChange = useCallback((event) => {
    const file = event.target.files[0];
    console.log(file);

    setImageUrl(null);
    setUploadState(UploadState.Uploading);

    client
      .uploadImages([file])
      .then(([{ url }]) => {
        setImageUrl(url);
        setUploadState(UploadState.Uploaded);
      })
      .catch((error) => console.error(error));
  }, []);

  const inputElement = (
    <>
      <input type="file" accept="image/*" onChange={onFileChange} />
      <style jsx>{`
        // despite HTML's best efforts to make our life miserable, we can hide the default file input interface to build our own, non-ugly thing.
        // https://stackoverflow.com/questions/52563463/how-to-style-file-input
        input {
          position: absolute;
          top: 0;
          right: 0;
          min-width: 100%;
          min-height: 100%;
          opacity: 0;
          outline: none;
          cursor: inherit;
          display: block;
        }
      `}</style>
    </>
  );

  return (
    <div className="ImageUpload">
      <Switcher
        uploadState={uploadState}
        inputElement={inputElement}
        imageUrl={imageUrl}
      />

      <style jsx>{`
        .ImageUpload {
          display: block;
          background: var(--background-weak);
          border-radius: var(--large-corner-round);

          cursor: pointer;

          position: relative;

          //   box-shadow: var(--shadow-small);

          // was messing with layout
          line-height: 1;
        }
      `}</style>
    </div>
  );
}

function Switcher({ uploadState, inputElement, imageUrl }) {
  if (uploadState === UploadState.Emtpy) {
    return <EmptyUpload inputElement={inputElement} />;
  }

  if (uploadState === UploadState.Uploading) {
    return <Uploading />;
  }

  if (uploadState === UploadState.Uploaded) {
    return <Uploaded imageUrl={imageUrl} />;
  }

  throw new Error(`Unexpected state ${uploadState}`);
}

function EmptyUpload({ inputElement }) {
  return (
    <label>
      <Padding padding="16px">
        Upload Image
        <div className="ImageUpload-help">Click to browse or drop here</div>
        {inputElement}
        <style jsx>{`
          .ImageUpload-help {
            font: var(--font-body);
            font-size: var(--size-small);
            color: var(--foreground-weak);
          }
        `}</style>
      </Padding>
    </label>
  );
}

function Uploading({}) {
  return <Padding padding="16px">Uploading...</Padding>;
}

function Uploaded({ imageUrl }) {
  return (
    <>
      <img src={imageUrl} />
      <Padding padding="16px">
        <Row>
          <RevealButton onClick={undefined}>
            <Padding padding="8px">Remove</Padding>
          </RevealButton>
        </Row>
      </Padding>

      <style jsx>{`
        img {
          width: 100%;
          filter: var(--filter-tint);
        }
      `}</style>
    </>
  );
}
