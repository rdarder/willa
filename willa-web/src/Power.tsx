import React from "react";
import { Willa } from "./serialization";

export enum MotorMode {
  idle = "idle",
  brake = "brake",
  forward = "forward",
  reverse = "reverse",
}

export interface Active {
  mode: MotorMode.forward | MotorMode.reverse;
  power: number;
}
export interface Idle {
  mode: MotorMode.idle;
}
export interface Break {
  mode: MotorMode.brake;
}

export type MotorControl = Active | Idle | Break;

interface PowerProps {
  current: MotorControl;
  onChange: (power: MotorControl) => void;
}

interface BreakTouchArea {
  zone: MotorMode.brake;
}
interface ActiveTouchArea {
  zone: MotorMode.forward | MotorMode.reverse;
  power: number;
}
interface UnknownTouchArea {
  zone: MotorMode.idle;
}
type PowerArea = BreakTouchArea | ActiveTouchArea | UnknownTouchArea;

export class MotorController extends React.Component<PowerProps, {}> {
  BREAK_AREA = 0.2;
  OUT_AREA = 0.05;
  constructor(props: PowerProps) {
    super(props);
    this.state = {};
  }

  getTouchArea = (event: TouchEvent, current: MotorMode): PowerArea => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = event.touches[0].clientX - rect.left;
    const y = event.touches[0].clientY - rect.top;
    const aspectRatio = rect.width / rect.height;
    const maxOutY = rect.height * this.MAX_OUT_AREA;
    const maxOutX = rect.width * this.MAX_OUT_AREA;
    const breakStartY = rect.height * (1 - this.BREAK_AREA);
    const breakStartX = rect.width * (1 - this.BREAK_AREA);

    const isInBrakeZone = x > breakStartX && y > breakStartY;
    if (isInBrakeZone) {
      return { zone: MotorMode.brake };
    }
    if (x > rect.width || x < 0 || y > rect.height || y < 0) {
      return { zone: MotorMode.idle };
    }
    const powerSide =
      x / aspectRatio > y ? MotorMode.forward : MotorMode.reverse;

    if (
      current === MotorMode.forward ||
      (current !== MotorMode.reverse && powerSide === MotorMode.forward)
    ) {
      // if we're in forward mode but the touch is in the reverse zone,
      // we honor the vertical axis of the touch and keep it forward.
      // Equivalent behavior for reverse.
      // For going from forward to reverse, user must go through break or idle.
      return {
        zone: MotorMode.forward,
        power: Math.max(
          0,
          Math.min(1, (breakStartY - y) / (breakStartY - maxOutY))
        ),
      };
    } else {
      return {
        zone: MotorMode.reverse,
        power: Math.max(
          0,
          Math.min(1, (breakStartX - x) / (breakStartX - maxOutX))
        ),
      };
    }
  };

  onTouchMove = (event: TouchEvent) => {
    const mode = this.props.current.mode;
    const area = this.getTouchArea(event, mode);
    switch (mode) {
      case MotorMode.idle:
        if (area.zone === MotorMode.idle) {
          break;
        } else if (area.zone === MotorMode.brake) {
          this.props.onChange({ mode: MotorMode.brake });
        } else if (area.zone === MotorMode.forward) {
          this.props.onChange({ mode: MotorMode.forward, power: area.power });
        } else if (area.zone === MotorMode.reverse) {
          this.props.onChange({ mode: MotorMode.reverse, power: area.power });
        } else {
          throw new Error("unknown touch area for state");
        }
        break;
      case MotorMode.brake:
        if (area.zone === MotorMode.idle) {
          this.props.onChange({ mode: MotorMode.idle });
        } else if (area.zone === MotorMode.brake) {
          break;
        } else if (area.zone === MotorMode.forward) {
          this.props.onChange({ mode: MotorMode.forward, power: area.power });
        } else if (area.zone === MotorMode.reverse) {
          this.props.onChange({ mode: MotorMode.reverse, power: area.power });
        } else {
          throw new Error("unknown touch area for state");
        }
        break;

      case MotorMode.forward:
        if (area.zone === MotorMode.idle) {
          this.props.onChange({ mode: MotorMode.idle });
        } else if (area.zone === MotorMode.brake) {
          this.props.onChange({ mode: MotorMode.brake });
        } else if (area.zone === MotorMode.forward) {
          this.props.onChange({ mode: MotorMode.forward, power: area.power });
        } else if (area.zone === MotorMode.reverse) {
          break;
        } else {
          throw new Error("unknown touch area for state");
        }
        break;
      case MotorMode.reverse:
        if (area.zone === MotorMode.idle) {
          this.props.onChange({ mode: MotorMode.idle });
        } else if (area.zone === MotorMode.brake) {
          this.props.onChange({ mode: MotorMode.brake });
        } else if (area.zone === MotorMode.forward) {
          break;
        } else if (area.zone === MotorMode.reverse) {
          this.props.onChange({ mode: MotorMode.reverse, power: area.power });
        } else {
          throw new Error("unknown touch area for state");
        }
        break;
      default:
        throw new Error("unknown power mode");
    }
  };
  onTouchEnd = (event: TouchEvent) => {
    this.props.onChange({ mode: MotorMode.idle });
  };
  onTouchStart = (event: TouchEvent) => {
    this.onTouchMove(event);
  };

  render(): React.ReactNode {
    const mode = this.props.current.mode;
    const power =
      mode === MotorMode.forward || mode === MotorMode.reverse
        ? this.props.current.power
        : 0;
    return (
      <div
        style={{
          border: "1px solid black",
          width: "60%",
          backgroundColor: "#FAFAFA",
        }}
        onTouchStart={this.onTouchStart as any}
        onTouchEnd={this.onTouchEnd as any}
        onTouchMove={this.onTouchMove as any}
      >
        <div>Mode: {mode}</div>
        <div>Power: {power.toFixed(2)}</div>
      </div>
    );
  }
}
