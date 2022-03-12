import { LemmyWebsocket, Login } from "lemmy-js-client";

export default class LettuceClient {
  websocket: WebSocket;
  client: LemmyWebsocket;

  constructor(url) {
    // @ts-ignore line
    if (typeof window !== "undefined") {
      this.websocket = new window.WebSocket(url);

      this.websocket.onmessage = this.handleMessage.bind(this);
      this.websocket.onerror = this.handleError.bind(this);
    } else {
      throw new Error("LettuceClient must mot be initialized on SSR");
    }
    this.client = new LemmyWebsocket();
  }

  protected handleMessage(event) {
    console.log(JSON.parse(event.data));
  }

  protected handleError(error) {
    console.error(error);
  }

  protected send(message: string) {
    this.websocket.send(message);
  }

  login(form: Login) {
    this.send(this.client.login(form));
  }
}
