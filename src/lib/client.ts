import { LemmyHttp, LemmyWebsocket } from "lemmy-js-client";

function baseUrl() {
  return window.location.origin;
}

export default class Client {
  websocket: LemmyWebsocket;
  http: LemmyHttp;
  token?: string;

  constructor() {
    this.http = new LemmyHttp(baseUrl());
    this.websocket = new LemmyWebsocket();
  }

  login({ username, password }) {
    return this.http
      .login({ username_or_email: username, password })
      .then((response) => {
        // @ts-ignore bc the types are wrong
        if (!response.error && response.jwt) {
          this.token = response.jwt;

          return {
            success: true,
          };
        } else {
          console.log(response);
          return {
            // @ts-ignore
            error: response.error || response,
            success: false,
          };
        }
      });
  }
}
