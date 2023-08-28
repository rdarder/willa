import React from "react";
import "./App.css";
import { DriveController } from "./DriveController";
import { Loader } from "./Loader";

enum GameState {
  Intro,
  LoadingError,
  Driving,
}
export function App() {
  const [loaderState, setLoaderState] = React.useState(GameState.Intro);
  const [loadingError, setLoadingError] = React.useState<string | null>(null);
  const [webSocket, setWebSocket] = React.useState<WebSocket | null>(null);

  const onStart = (ws: WebSocket): void => {
    setLoaderState(GameState.Driving);
    setWebSocket(ws);
  };
  const onError = (message: string): void => {
    setLoaderState(GameState.LoadingError);
    setLoadingError(message);
  };
  if (loaderState === GameState.Driving) {
    return <DriveController webSocket={webSocket!}></DriveController>;
  } else if (loaderState === GameState.LoadingError) {
    return <div>{loadingError}</div>;
  } else {
    return <Loader onStart={onStart} onError={onError}></Loader>;
  }
}
