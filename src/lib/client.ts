import { LemmyHttp, LemmyWebsocket } from "lemmy-js-client";

function baseUrl() {
  const host = process.env.NEXT_PUBLIC_LEMMY_EXTERNAL_HOST;
  const isHttps = process.env.NEXT_PUBLIC_LEMMY_HTTPS;
  const protocol = isHttps ? "https" : "http";

  return `${protocol}://${host}/api/v3/ws`;
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
