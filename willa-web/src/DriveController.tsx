import React from "react";
import { MotorControl, MotorController, MotorMode } from "./Power";
import { Steering } from "./Steering";
import * as flatbuffers from "flatbuffers";
import { Willa } from "./serialization";

export interface DriveControllerProps {
  webSocket: WebSocket;
}
interface DriveControllerState {
  steering: number;
  motorControl: MotorControl;
  commandSendLoop: number | null;
}

export class DriveController extends React.Component<
  DriveControllerProps,
  DriveControllerState
> {
  constructor(props: DriveControllerProps) {
    super(props);
    this.state = {
      steering: 0,
      motorControl: { mode: MotorMode.idle },
      commandSendLoop: null,
    };
  }
  componentDidMount(): void {
    this.setState({
      commandSendLoop: window.setInterval(this.sendCommand, 100),
    });
  }

  componentWillUnmount(): void {
    if (this.state.commandSendLoop !== null) {
      window.clearInterval(this.state.commandSendLoop);
      this.setState({ commandSendLoop: null });
    }
  }
  sendCommand = (): void => {
    const builder = new flatbuffers.Builder(100);
    Willa.DriveController.DriveControl.startDriveControl(builder);
    Willa.DriveController.DriveControl.addSteer(builder, this.state.steering);
    Willa.DriveController.DriveControl.addMotorMode(
      builder,
      serializeMotorMode(this.state.motorControl.mode)
    );
    if (
      this.state.motorControl.mode === MotorMode.forward ||
      this.state.motorControl.mode === MotorMode.reverse
    ) {
      Willa.DriveController.DriveControl.addMotorPower(
        builder,
        this.state.motorControl.power
      );
    }
    const endPos = Willa.DriveController.DriveControl.endDriveControl(builder);
    builder.finish(endPos);
    let buf = builder.asUint8Array();
    this.props.webSocket.send(buf);
  };

  render(): React.ReactNode {
    return (
      <div style={{ height: "100vh", width: "100vw", overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "100vh",
            width: "100vw",
            overflow: "hidden",
            alignItems: "stretch",
          }}
        >
          <Steering
            current={this.state.steering}
            onChange={(steering) => {
              this.setState({ steering });
            }}
          ></Steering>

          <MotorController
            current={this.state.motorControl}
            onChange={(motorControl) => {
              this.setState({ motorControl });
            }}
          ></MotorController>
        </div>
      </div>
    );
  }
}

function serializeMotorMode(mode: MotorMode): Willa.DriveController.MotorMode {
  switch (mode) {
    case MotorMode.idle:
      return Willa.DriveController.MotorMode.Idle;
    case MotorMode.brake:
      return Willa.DriveController.MotorMode.Brake;
    case MotorMode.forward:
      return Willa.DriveController.MotorMode.Forward;
    case MotorMode.reverse:
      return Willa.DriveController.MotorMode.Reverse;
    default:
      throw new Error("unknown motor mode");
  }
}
