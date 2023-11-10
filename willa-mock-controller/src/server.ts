import WebSocket from "ws";
import * as flatbuffers from "flatbuffers";
import { Willa } from "./serialization";

const wss = new WebSocket.WebSocketServer({ port: 5000 });

wss.on("connection", function connection(ws) {
  console.log("connection attempt!");
  ws.on("error", console.error);

  ws.on("message", function message(message: Buffer) {
    let buffer = new flatbuffers.ByteBuffer(message);
    const control = Willa.DriveController.DriveControl.getRootAsDriveControl(
      buffer as any
    );
    console.log(
      JSON.stringify({
        steer: control.steer(),
        motorMode: control.motorMode(),
        motorPower: control.motorPower(),
        frontLights: control.frontLights(),
        rearLights: control.rearLights(),
        horn: control.horn(),
      })
    );
  });
});
