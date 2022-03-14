import { LemmyHttp, LemmyWebsocket } from "lemmy-js-client";

function baseUrl() {
  return process.env.NEXT_PUBLIC_LEMMY_HOST;
}

export default class Client {
  http: LemmyHttp;
  auth?: string;

  constructor(token?) {
    this.http = new LemmyHttp(baseUrl());
    this.auth = token;
  }

  private getAuth() {
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

  logout() {
    return this.http.log;
  }

  getSite() {
    return this.http.getSite(this.getAuth());
  }
}
