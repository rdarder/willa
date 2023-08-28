import React from "react";

export interface LoaderProps {
  onStart: (ws: WebSocket) => void;
  onError: (message: string) => void;
}
export function Loader(props: LoaderProps): JSX.Element {
  const onClick = async () => {
    document.documentElement.requestFullscreen();
    try {
      await window.screen.orientation.lock("landscape");
    } catch (e) {
      console.log("cannot lock landscape mode");
    }
    try {
      const ws = await connectWebsocket();
      if (typeof DeviceOrientationEvent === "undefined") {
        props.onError("DeviceOrientationEvent is not supported.");
      } else {
        props.onStart(ws);
      }
    } catch (e) {
      props.onError("error connecting websocket");
    }
  };
  return <button onClick={onClick}>Play</button>;
}

function connectWebsocket(): Promise<WebSocket> {
  const host = window.location.host;
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(`ws://${host}/controller`);
    ws.onerror = (ev: Event) => {
      reject(ev);
    };
    ws.onopen = (ev: Event) => {
      resolve(ws);
    };
  });
}
