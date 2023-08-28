import React from "react";

export interface SteeringProps {
  current: number;
  onChange: (rotation: number) => void;
}
export class Steering extends React.Component<SteeringProps, {}> {
  MAX_OUT_ANGLE = 60;

  constructor(props: any) {
    super(props);
  }
  componentDidMount() {
    window.addEventListener("deviceorientation", this.handleOrientation, true);
  }

  componentWillUnmount() {
    window.removeEventListener(
      "deviceorientation",
      this.handleOrientation,
      true
    );
  }

  handleOrientation = (event: DeviceOrientationEvent) => {
    this.props.onChange(
      Math.min(1, Math.max(-1, event.beta! / this.MAX_OUT_ANGLE))
    );
  };

  render() {
    return (
      <div style={{ width: "40%" }}>
        <div>rotation: {this.props.current.toFixed(2)}</div>
      </div>
    );
  }
}
