import { LemmyWebsocket } from "lemmy-js-client";
import { useEffect, useState } from "react";
import { useClient } from "./auth";

function baseWsUrl() {
  const isSecure = JSON.parse(process.env.NEXT_PUBLIC_LEMMY_SECURE);
  const protocol = isSecure ? "wss" : "ws";
  const domain = process.env.NEXT_PUBLIC_LEMMY_HOST;

  return `${protocol}://${domain}`;
}

class WebsocketClient {
  api: LemmyWebsocket;
  websocket: WebSocket;
  auth?: string;

  constructor(onMessage, token?) {
    this.api = new LemmyWebsocket();
    this.websocket = new WebSocket(`${baseWsUrl()}/api/v3/ws`);
    this.websocket.onmessage = (message) => onMessage(JSON.parse(message.data));
    this.auth = token;

    this.websocket.onerror = (error) => console.error(error);
  }

  close() {
    this.websocket.close();
  }

  private send(message: string) {
    this.websocket.send(message);
  }

  postJoin(id) {
    this.send(this.api.postJoin({ post_id: id }));
  }
}

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

export function useNewSubscribtion(
  setup: (c: WebsocketClient) => void,
  onMessage: (message) => void,
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
