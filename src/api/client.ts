import { GetPosts, LemmyHttp, LemmyWebsocket } from "lemmy-js-client";

function baseUrl() {
  return process.env.NEXT_PUBLIC_LEMMY_HOST;
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

export default class Client {
  http: LemmyHttp;
  auth?: string;

  constructor(token?) {
    this.http = new LemmyHttp(baseUrl());
    this.auth = token;
  }

  private getAuth(): { auth?: string } {
    if (this.auth) {
      return { auth: this.auth };
    }

    return {};
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
    return this.http.getSite(this.getAuth());
  }

  getCaptcha() {
    return this.http.getCaptcha();
  }

  createCommunity(community: Community) {
    if (!this.auth) {
      throw new Error("Cannot create community while logged out");
    }

    return this.http.createCommunity({ auth: this.auth, ...community });
  }

  getCommunity(name: string) {
    return this.http.getCommunity({ ...this.getAuth(), name });
  }

  getPosts(getPosts: GetPosts) {
    return this.http.getPosts({
      ...this.getAuth(),
      ...getPosts,
    });
  }

  createPost(post: CreatePostSimple) {
    return this.http.createPost({ auth: this.auth, ...post });
  }

  getPost(id: number) {
    return this.http.getPost({ ...this.getAuth(), id });
  }

  likePost(id, vote) {
    return this.http.likePost({ auth: this.auth, post_id: id, score: vote });
  }

  createComment(comment: CreateCommentSimple) {
    return this.http.createComment({ auth: this.auth, ...comment });
  }
}
