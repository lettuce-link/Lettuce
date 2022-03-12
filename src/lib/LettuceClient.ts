import { LemmyWebsocket } from "lemmy-js-client";

export default class LettuceClient {
  websocket: WebSocket;
  client: LemmyWebsocket;

  constructor(url) {
    // @ts-ignore line
    if (typeof window !== "undefined") {
      this.websocket = new window.WebSocket(url);
    } else {
      throw new Error("LettuceClient must mot be initialized on SSR");
    }
    this.client = new LemmyWebsocket();
  }
}
