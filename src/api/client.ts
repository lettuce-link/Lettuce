import { GetPosts, LemmyHttp, LemmyWebsocket } from "lemmy-js-client";

function baseHttpUrl() {
  const isSecure = JSON.parse(process.env.NEXT_PUBLIC_LEMMY_SECURE);
  const protocol = isSecure ? "https" : "http";
  const domain = process.env.NEXT_PUBLIC_LEMMY_HOST;

  return `${protocol}://${domain}`;
}

export interface CreateCommunitySimple {
  name: string;
  title: string;
  description?: string;
  icon?: string;
  banner?: string;
  nsfw?: boolean;
}

export interface CreatePostSimple {
  name: string;
  url?: string;
  body?: string;
  nsfw?: boolean;
  community_id: number;
}

export interface CreateCommentSimple {
  content: string;
  parent_id?: number;
  post_id: number;
}

export interface EditCommunitySimple {
  community_id: number;
  title?: string;
  description?: string;
  icon?: string;
  banner?: string;
  nsfw?: boolean;
}

export interface EditSiteSimple {
  name?: string;
  sidebar?: string;
  description?: string;
  icon?: string;
  banner?: string;
  enable_downvotes?: boolean;
  enable_nsfw?: boolean;
  community_creation_admin_only?: boolean;
  private_instance?: boolean;
  default_theme?: string;
}

export default class Client {
  http: LemmyHttp;
  auth?: string;

  constructor(token?) {
    this.http = new LemmyHttp(baseHttpUrl());
    this.auth = token;
  }

  isLoggedIn() {
    return !!this.auth;
  }

  private getOptionalAuthObject(): { auth?: string } {
    if (this.auth) {
      return { auth: this.auth };
    }

    return {};
  }

  getAuth() {
    return this.auth;
  }

  login({ username, password }) {
    return this.http
      .login({ username_or_email: username, password })
      .then((response) => {
        // @ts-ignore bc the types are wrong
        if (!response.error && response.jwt) {
          return {
            success: true,
            auth: response.jwt,
          };
        } else {
          return {
            // @ts-ignore
            error: response.error || response,
            success: false,
          };
        }
      });
  }

  register({ username, password }) {
    return this.http.register({
      username,
      password,
      password_verify: password,
      show_nsfw: false,
    });
  }

  getSite() {
    return this.http.getSite(this.getOptionalAuthObject());
  }

  getCaptcha() {
    return this.http.getCaptcha();
  }

  createCommunity(community: CreateCommunitySimple) {
    if (!this.auth) {
      throw new Error("Cannot create community while logged out");
    }

    return this.http.createCommunity({ auth: this.auth, ...community });
  }

  getCommunity(name: string) {
    return this.http.getCommunity({ ...this.getOptionalAuthObject(), name });
  }

  getPosts(getPosts: GetPosts) {
    return this.http.getPosts({
      ...this.getOptionalAuthObject(),
      ...getPosts,
    });
  }

  createPost(post: CreatePostSimple) {
    return this.http.createPost({ auth: this.auth, ...post });
  }

  getPost(id: number) {
    return this.http.getPost({ ...this.getOptionalAuthObject(), id });
  }

  likePost(id, vote) {
    return this.http.likePost({ auth: this.auth, post_id: id, score: vote });
  }

  createComment(comment: CreateCommentSimple) {
    return this.http.createComment({ auth: this.auth, ...comment });
  }

  likeComment(commentId, vote) {
    return this.http.likeComment({
      auth: this.auth,
      comment_id: commentId,
      score: vote,
    });
  }

  followCommunity(communityId, doFollow) {
    return this.http.followCommunity({
      auth: this.auth,
      community_id: communityId,
      follow: doFollow,
    });
  }

  editCommunity(settings: EditCommunitySimple) {
    return this.http.editCommunity({
      auth: this.auth,
      ...settings,
    });
  }

  editSite(site: EditSiteSimple) {
    return this.http.editSite({
      ...site,
      auth: this.auth,
    });
  }
}
