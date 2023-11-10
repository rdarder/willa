import * as flatbuffers from 'flatbuffers';
import { LitElement, PropertyValues, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import { Willa } from './serialization';
import { MotorControl, MotorMode } from './motor';
import { SteeringChange, DriveSteering } from './steering';
import './motor';
import './steering';
import './board';
import settings from './settings';
import { BoardState, DriveMode, LightsState } from './board';

export interface DriveCommand {
  steer: number;
  motor_mode: Willa.DriveController.MotorMode;
  motor_power: number;
  front_lights: number;
  rear_lights: number;
  horn: number;
}

export class DriveCommandSender {
  private recurringCommand: number | null = null;
  private webSocket: WebSocket | null = null;
  private command: DriveCommand = {
    steer: 0,
    motor_mode: Willa.DriveController.MotorMode.Idle,
    motor_power: 0,
    front_lights: 0,
    rear_lights: 0,
    horn: 0,
  };

  enable(webSocket: WebSocket): void {
    this.webSocket = webSocket;
    this.disable();
    this.recurringCommand = window.setInterval(
      this.sendCommand,
      settings.sendCommandIntervalMillis
    );
  }

  disable(): void {
    if (this.recurringCommand !== null) {
      clearTimeout(this.recurringCommand!);
    }
  }
  updateCommand(command: DriveCommand) {
    this.command = command;
  }

  private serializeCommand(): Uint8Array {
    const builder = new flatbuffers.Builder(100);
    Willa.DriveController.DriveControl.startDriveControl(builder);
    Willa.DriveController.DriveControl.addSteer(builder, this.command.steer);
    Willa.DriveController.DriveControl.addMotorMode(
      builder,
      this.command.motor_mode
    );
    Willa.DriveController.DriveControl.addMotorPower(
      builder,
      this.command.motor_power
    );
    Willa.DriveController.DriveControl.addFrontLights(
      builder,
      this.command.front_lights
    );
    Willa.DriveController.DriveControl.addRearLights(
      builder,
      this.command.rear_lights
    );
    Willa.DriveController.DriveControl.addHorn(builder, this.command.horn);
    const endPos = Willa.DriveController.DriveControl.endDriveControl(builder);
    builder.finish(endPos);
    return builder.asUint8Array();
  }

  private sendCommand = (): void => {
    if (this.webSocket === null) {
      throw new Error('no websocket');
    }
    this.webSocket.send(this.serializeCommand());
  };
}

export interface ControllerState {
  steering: SteeringChange;
  motorControl: MotorControl;
  board: BoardState;
}

@customElement('drive-controls')
export class DriveControls extends LitElement {
  @property({ type: Object, attribute: false })
  webSocket: WebSocket | null = null;

  @state()
  private steering: number = 0;

  @state()
  private motorControl: MotorControl = { mode: MotorMode.idle, power: 0 };

  @state()
  private boardState: BoardState = {
    lights: LightsState.off,
    horn: false,
    mode: DriveMode.handling,
  };
  @state()
  private debug: boolean = false;

  private commandSender = new DriveCommandSender();

  static get styles() {
    return css`
      :host {
        height: 100vh;
        width: 100vw;
        overflow: hidden;
        display: flex;
        flex-direction: row;
        align-items: stretch;
      }
      #left-panel {
        display: flex;
        flex-direction: column;
        width: 40%;
      }
      #debug {
        position: absolute;
        left: 50%;
        text-align: left;
      }
    `;
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.commandSender.disable();
  }

  willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('webSocket')) {
      this.commandSender.disable();
      if (this.webSocket !== null) {
        this.commandSender.enable(this.webSocket);
      }
    }
  }

  private debugPanel() {
    const converted = this.getCommand();
    if (this.debug) {
      return html` <pre id="debug">

motor power: ${this.motorControl.power.toFixed(2)} (${converted.motor_power})
motor direction: ${this.motorControl.mode} (${converted.motor_mode})
steering: ${this.steering.toFixed(2)} (${converted.steer})
lights: ${this.boardState
          .lights} (${converted.front_lights}) (${converted.rear_lights})
horn: ${this.boardState.horn} (${converted.horn})
drive mode: ${DriveMode[this.boardState.mode]}
      </pre
      >`;
    } else {
      return null;
    }
  }

  render() {
    return html`
      <div id="left-panel">
        ${this.debugPanel()}
        <drive-steering
          .current=${this.steering}
          @change=${this.onSteeringChange}
        ></drive-steering>
        <control-board
          ?debug=${this.debug}
          @change=${this.onBoardChange}
          @toggleDebug=${this.toggleDebug}
        ></control-board>
      </div>

      <drive-motor
        .current=${this.motorControl}
        @change=${this.onMotorControlChange}
      ></drive-motor>
    `;
  }
  private onBoardChange(event: CustomEvent<BoardState>) {
    this.boardState = event.detail as BoardState;
    this.updateCommand();
  }

  private onSteeringChange(event: CustomEvent<SteeringChange>): void {
    this.steering = (event.detail as SteeringChange).steering;
    this.updateCommand();
  }
  private onMotorControlChange(event: CustomEvent<MotorControl>): void {
    this.motorControl = event.detail as MotorControl;
    this.updateCommand();
  }
  private toggleDebug(): void {
    this.debug = !this.debug;
  }
  private updateCommand(): void {
    this.commandSender.updateCommand(this.getCommand());
  }

  getCommand(): DriveCommand {
    const powerAdjust = this.boardState.mode === DriveMode.handling ? 0.5 : 1;
    return {
      steer: this.to_short_fraction(this.steering),
      motor_mode: DriveControls.serializeMotorMode(this.motorControl.mode),
      motor_power: this.to_ushort_fraction(
        this.motorControl.power * powerAdjust
      ),
      front_lights: this.to_ushort_fraction(this.getFrontLights()),
      rear_lights: this.to_ushort_fraction(this.getRearLights()),
      horn: this.boardState.horn ? 523 : 0,
    };
  }
  to_short_fraction(value: number): number {
    return Math.round(value * MAX_SHORT);
  }
  to_ushort_fraction(value: number): number {
    return Math.round(value * MAX_USHORT);
  }

  getFrontLights(): number {
    switch (this.boardState.lights) {
      case LightsState.on:
        return 0.4;
      case LightsState.high:
        return 1;
      case LightsState.off:
        return 0;
    }
  }
  getRearLights(): number {
    switch (this.boardState.lights) {
      case LightsState.on:
      case LightsState.high:
        if (this.motorControl.mode === MotorMode.brake) {
          return 1;
        }
        return 0.3;
      case LightsState.off:
        return 0;
    }
  }

  static serializeMotorMode(mode: MotorMode): Willa.DriveController.MotorMode {
    //TODO: this should go to the drive controls.
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
        throw new Error('unknown motor mode');
    }
  }
}

const MAX_USHORT = 65535;
const MAX_SHORT = 32767;
