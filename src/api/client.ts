import {
  GetPosts,
  LemmyHttp,
  LemmyWebsocket,
  ListingType,
  SortType,
} from "lemmy-js-client";

const PICTRS_IMAGE_URI = "/pictrs/image";

function baseHttpUrl() {
  const isSecure = JSON.parse(process.env.NEXT_PUBLIC_LEMMY_SECURE);
  const protocol = isSecure ? "https" : "http";
  const domain = process.env.NEXT_PUBLIC_LEMMY_HOST;

  return `${protocol}://${domain}`;
}

// Below we define simplified request input types. We have removed the "auth" field because that is provided automatically by the client. Some other fields have been removed too, either because we don't support them or because we have simplified the API.

export interface RegisterSimple {
  username: string;
  email: string;
  password: string;
  /**
   * Captcha is only checked if these are enabled in the server.
   */
  captcha_uuid?: string;
  captcha_answer?: string;
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

export interface ListCommunitiesSimple {
  type_?: ListingType;
  sort?: SortType;
  page?: number;
  limit?: number;
}

/**
 * A wrapper for the API client – provides a nice interface for making requests
 *
 * The methods in this wrapper pretty much 1-to-1 map those defined in the lemmy-js-client LemmyHttp class. (except the ones that aren't implemented yet). However, they have been simplified where possible, and we automatically pass the authentication token given in the constructor, so you don't have to.
 */
export default class Client {
  http: LemmyHttp;
  auth?: string;

  /**
   * Construct a new client with the provided authentication token.
   * To update the token, you should just construct a new client and use that.
   * @param token
   */
  constructor(token?) {
    this.http = new LemmyHttp(baseHttpUrl());
    this.auth = token;
  }

  /**
   * @returns true if the client has an authentication token set
   */
  isLoggedIn() {
    return !!this.auth;
  }

  /**
   * @returns an {auth: string} with the authentication token, or {} if none is set
   */
  private getOptionalAuthObject(): { auth?: string } {
    if (this.auth) {
      return { auth: this.auth };
    }

    return {};
  }

  getAuth() {
    return this.auth;
  }

  /**
   * Performs a login request. Note: does not set the resulting authentication token. Instead, the response is returned and you must use it yourself.
   */
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

  register(register: RegisterSimple) {
    return this.http.register({
      ...register,
      password_verify: register.password,
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

  verifyEmail(token) {
    return this.http.verifyEmail({ token });
  }

  changePassword({ oldPassword, newPassword }) {
    return this.http.changePassword({
      auth: this.auth,
      old_password: oldPassword,
      new_password: newPassword,
      new_password_verify: newPassword,
    });
  }

  listCommunities(search: ListCommunitiesSimple) {
    return this.http.listCommunities({
      ...search,
      ...this.getOptionalAuthObject(),
    });
  }

  // mostly stolen from lemmy-ui (image-upload-form.tsx)
  uploadImages(files: any[]) {
    const formData = new FormData();
    files.forEach((file) => formData.append("images[]", file));

    return fetch(PICTRS_IMAGE_URI, {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.msg == "ok") {
          return res.files.map(({ delete_token, file }) => ({
            delete_token,
            url: getAbsoluteUrlFromImage(file),
          }));
        } else {
          throw res;
        }
      });
  }
}

function getAbsoluteUrlFromImage(file) {
  const url = new URL(`${PICTRS_IMAGE_URI}/${file}`, window.location.href);
  return url.toString();
}
