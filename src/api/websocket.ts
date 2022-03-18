import { LemmyWebsocket, WebSocketResponse } from "lemmy-js-client";
import { useEffect, useState } from "react";
import { useClient } from "./auth";

function baseWsUrl() {
  const isSecure = JSON.parse(process.env.NEXT_PUBLIC_LEMMY_SECURE);
  const protocol = isSecure ? "wss" : "ws";
  const domain = process.env.NEXT_PUBLIC_LEMMY_HOST;

  return `${protocol}://${domain}`;
}

/**
 * A wrapper for the websocket API.
 *
 */
class WebsocketClient {
  api: LemmyWebsocket;
  websocket: Promise<WebSocket>;
  auth?: string;

  /**
   * @param onMessage the function to be called for each new message (parameter: parsed json object)
   * @param token the authentication token to use
   */
  constructor(onMessage, token?) {
    this.api = new LemmyWebsocket();

    this.websocket = new Promise(function (resolve, reject) {
      const ws = new WebSocket(`${baseWsUrl()}/api/v3/ws`);
      ws.onopen = function () {
        resolve(ws);
      };
      ws.onerror = function (err) {
        reject(err);
      };

      ws.onmessage = (message) => onMessage(JSON.parse(message.data));
    });
    this.auth = token;
  }

  /**
   * Close the websocket request
   */
  close() {
    this.websocket.then((ws) => ws.close());
  }

  private send(message: string) {
    this.websocket.then((ws) => ws.send(message));
  }

  /**
   * Websocket join on the specified post.
   * Sending this will let you receive updates on the post live (such as new comments, likes, etc)
   * @param id post ID to join
   */
  postJoin(id) {
    this.send(this.api.postJoin({ post_id: id }));
  }
}

/**
 * Provides a new websocket client. This will create a new client at each call site, making debuggin easier (you'll know for sure that the messages you receive have been requested at this call site, because noone else could have requested anything for you).
 * Perhaps this comes at a slight performance cost (creating a new request) but I'm willing to pay that cost for madness-free development.
 *
 * The client is updated (recreated) whenever the authentication token changes (on login, logout)
 *
 * @param onMessage
 * @returns
 */
export function useNewWebsocketClient(onMessage): WebsocketClient {
  const client = useClient();
  const [websocketClient, setWebSocketClient] = useState(null);

  useEffect(() => {
    const ws = new WebsocketClient(onMessage, client.getAuth());
    setWebSocketClient(ws);

    return () => {
      ws.close();
    };
  }, []);

  useEffect(() => {
    if (websocketClient) {
      websocketClient.auth = client.getAuth();

      // not sure about this (does it even work? hooks are weird), but i think we want the users of the ws client to update when auth changes.
      setWebSocketClient((x) => x);
    }
  }, [client]);

  return websocketClient;
}

export interface Message {
  op: string;
  data: any;
}

/**
 * Manages a websocket client
 * @param setup the function to set up the connection with. Make all your desired api calls here to subscribe to messages.
 * @param onMessage called when a message is received.
 * @param dependencies when one of these changes, `setup` will get called again so you can subscribe to messages based on the new dependencies.
 */
export function useNewSubscribtion(
  setup: (c: WebsocketClient) => void,
  onMessage: (message: Message) => void,
  dependencies
) {
  const client = useNewWebsocketClient(onMessage);

  useEffect(() => {
    if (client === null) {
      return;
    }
    setup(client);
  }, [client, ...dependencies]);
}
