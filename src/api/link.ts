export function communityLink(name) {
  return `/community/${name}`;
}

export function newPostLink(community) {
  return `${communityLink(community)}/new_post`;
}
