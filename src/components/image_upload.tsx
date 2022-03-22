import { useClient } from "api/auth";
import { RevealButton } from "atoms/input";
import { Padding, Row } from "atoms/layout";
import { useCallback, useState } from "react";

enum UploadState {
  Emtpy,
  Uploading,
  Uploaded,
}

export function useSingleImageUpload() {
  const [imageUrl, setImageUrl] = useState(null);
  const [uploadState, setUploadState] = useState(UploadState.Emtpy);

  const isLoading = uploadState === UploadState.Uploading;

  return {
    imageUrl,
    isImageLoading: isLoading,
    imageUploadProps: {
      imageUrl,
      setImageUrl,
      uploadState,
      setUploadState,
    },
  };
}

export function SingleImageUpload({
  imageUrl,
  setImageUrl,
  uploadState,
  setUploadState,
}) {
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

  const onRemove = useCallback(() => {
    setImageUrl(null);
    setUploadState(UploadState.Emtpy);
  }, []);

  return (
    <div className="ImageUpload">
      <Switcher
        uploadState={uploadState}
        onFileChange={onFileChange}
        imageUrl={imageUrl}
        onRemove={onRemove}
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

function ImageInput({ onFileChange }) {
  return (
    <>
      <input type="file" accept="image/*" onChange={onFileChange} />
      <style jsx>{`
        // despite HTML's best efforts to make our life miserable, we can hide the default file input interface to build our own, non-ugly thing.
        // https://stackoverflow.com/questions/52563463/how-to-style-file-input
        input {
          position: absolute;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          outline: none;
          cursor: inherit;
          display: block;
        }
      `}</style>
    </>
  );
}

function Switcher({ uploadState, onFileChange, imageUrl, onRemove }) {
  if (uploadState === UploadState.Emtpy) {
    return <EmptyUpload onFileChange={onFileChange} />;
  }

  if (uploadState === UploadState.Uploading) {
    return <Uploading />;
  }

  if (uploadState === UploadState.Uploaded) {
    return (
      <Uploaded
        imageUrl={imageUrl}
        onRemove={onRemove}
        onFileChange={onFileChange}
      />
    );
  }

  throw new Error(`Unexpected state ${uploadState}`);
}

function EmptyUpload({ onFileChange }) {
  return (
    <label>
      <Padding padding="16px">
        Upload Image
        <div className="ImageUpload-help">Click to browse or drop here</div>
        <ImageInput onFileChange={onFileChange} />
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

function Uploaded({ imageUrl, onRemove, onFileChange }) {
  return (
    <>
      <img src={imageUrl} />
      <Padding padding="16px">
        <Row>
          <RevealButton onClick={onRemove}>
            <Padding padding="8px">Remove</Padding>
          </RevealButton>
          <RevealButton>
            <label>
              <Padding padding="8px">
                Change
                <ImageInput onFileChange={onFileChange} />
              </Padding>
            </label>
          </RevealButton>
        </Row>
      </Padding>

      <style jsx>{`
        label {
          position: relative;
        }

        img {
          width: 100%;
          filter: var(--filter-tint);
        }
      `}</style>
    </>
  );
}
