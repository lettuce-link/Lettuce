import { LemmyHttp, LemmyWebsocket } from "lemmy-js-client";

function baseUrl() {
  return window.location.origin;
}

export default class Client {
  websocket: LemmyWebsocket;
  http: LemmyHttp;

  constructor() {
    this.http = new LemmyHttp(baseUrl());
    this.websocket = new LemmyWebsocket();
  }

  login({ username, password }) {
    return this.http.login({ username_or_email: username, password });
  }
}
