import { Post } from "lemmy-js-client";
import { useMemo } from "react";

/*
 * It is my hopes that, in the future, Lemmy will support multiple images per post. This should probably be a separate feature from the "link" field – idk why the 2 got merged into one thing in the first place. Until then, we have to do weird workarounds to allow for inline images.
 */

/**
 * Get post images
 */
function getPostImages(post: Post) {
  const url = post.url;

  if (isImage(url)) {
    return [url];
  }

  return [];
}

/**
 * Get post images, as an array of urls
 */
export function usePostImages(post: Post) {
  return useMemo(() => getPostImages(post), [post.url]);
}

const IMAGE_REGEX = /\.(apng|avif|gif|jpg|jpeg|jfif|pjpeg|pjp|png|webp)$/;

/**
 * A hacky way to determine if a given URL is an image.
 * Ideally, this shouldn't be necessary.
 */
function isImage(url: string) {
  return IMAGE_REGEX.test(url);
}

export function useDomain(url: string) {
  return useMemo(() => {
    const parsed = new URL(url);
    return parsed.hostname;
  }, [url]);
}

/**
 * Returns true iff the specified URL is in a trusted domain
 */
function isTrusted(domain: string) {
  return domain === window.location.hostname;
}

export function useIsTrusted(url) {
  const domain = useDomain(url);
  return useMemo(() => isTrusted(domain), [url]);
}
