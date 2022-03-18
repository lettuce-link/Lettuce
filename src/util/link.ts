// Links to various pages. These functions should be used for all links for easy refactoring.

export function homeLink() {
  return "/";
}

export function authLink() {
  return "/enter";
}

export function communityLink(name) {
  return `/community/${name}`;
}

export function newPostLink(community) {
  return `${communityLink(community)}/new_post`;
}

export function communitySettignsLink(community) {
  return `${communityLink(community)}/settings`;
}

export function siteSettingsLink() {
  return "/site_settings";
}

export function postLink(postId) {
  return `/post/${postId}`;
}
