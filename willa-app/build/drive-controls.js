var DriveControls_1;
import { __decorate } from "tslib";
import * as flatbuffers from 'flatbuffers';
import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Willa } from './serialization';
import { MotorMode } from './motor';
import './motor';
import './steering';
import './board';
import settings from './settings';
import { DriveMode, LightsState } from './board';
export class DriveCommandSender {
    constructor() {
        this.recurringCommand = null;
        this.webSocket = null;
        this.command = {
            steer: 0,
            motor_mode: Willa.DriveController.MotorMode.Idle,
            motor_power: 0,
            front_lights: 0,
            rear_lights: 0,
            horn: 0,
        };
        this.sendCommand = () => {
            if (this.webSocket === null) {
                throw new Error('no websocket');
            }
            this.webSocket.send(this.serializeCommand());
        };
    }
    enable(webSocket) {
        this.webSocket = webSocket;
        this.disable();
        this.recurringCommand = window.setInterval(this.sendCommand, settings.sendCommandIntervalMillis);
    }
    disable() {
        if (this.recurringCommand !== null) {
            clearTimeout(this.recurringCommand);
        }
    }
    updateCommand(command) {
        this.command = command;
    }
    serializeCommand() {
        const builder = new flatbuffers.Builder(100);
        Willa.DriveController.DriveControl.startDriveControl(builder);
        Willa.DriveController.DriveControl.addSteer(builder, this.command.steer);
        Willa.DriveController.DriveControl.addMotorMode(builder, this.command.motor_mode);
        Willa.DriveController.DriveControl.addMotorPower(builder, this.command.motor_power);
        Willa.DriveController.DriveControl.addFrontLights(builder, this.command.front_lights);
        Willa.DriveController.DriveControl.addRearLights(builder, this.command.rear_lights);
        Willa.DriveController.DriveControl.addHorn(builder, this.command.horn);
        const endPos = Willa.DriveController.DriveControl.endDriveControl(builder);
        builder.finish(endPos);
        return builder.asUint8Array();
    }
}
let DriveControls = DriveControls_1 = class DriveControls extends LitElement {
    constructor() {
        super(...arguments);
        this.webSocket = null;
        this.steering = 0;
        this.motorControl = { mode: MotorMode.idle, power: 0 };
        this.boardState = {
            lights: LightsState.off,
            horn: false,
            mode: DriveMode.handling,
        };
        this.debug = false;
        this.commandSender = new DriveCommandSender();
    }
    static get styles() {
        return css `
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
    disconnectedCallback() {
        super.disconnectedCallback();
        this.commandSender.disable();
    }
    willUpdate(changedProperties) {
        if (changedProperties.has('webSocket')) {
            this.commandSender.disable();
            if (this.webSocket !== null) {
                this.commandSender.enable(this.webSocket);
            }
        }
    }
    debugPanel() {
        const converted = this.getCommand();
        if (this.debug) {
            return html ` <pre id="debug">

motor power: ${this.motorControl.power.toFixed(2)} (${converted.motor_power})
motor direction: ${this.motorControl.mode} (${converted.motor_mode})
steering: ${this.steering.toFixed(2)} (${converted.steer})
lights: ${this.boardState
                .lights} (${converted.front_lights}) (${converted.rear_lights})
horn: ${this.boardState.horn} (${converted.horn})
drive mode: ${DriveMode[this.boardState.mode]}
      </pre
      >`;
        }
        else {
            return null;
        }
    }
    render() {
        return html `
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
    onBoardChange(event) {
        this.boardState = event.detail;
        this.updateCommand();
    }
    onSteeringChange(event) {
        this.steering = event.detail.steering;
        this.updateCommand();
    }
    onMotorControlChange(event) {
        this.motorControl = event.detail;
        this.updateCommand();
    }
    toggleDebug() {
        this.debug = !this.debug;
    }
    updateCommand() {
        this.commandSender.updateCommand(this.getCommand());
    }
    getCommand() {
        const powerAdjust = this.boardState.mode === DriveMode.handling ? 0.5 : 1;
        return {
            steer: this.to_short_fraction(this.steering),
            motor_mode: DriveControls_1.serializeMotorMode(this.motorControl.mode),
            motor_power: this.to_ushort_fraction(this.motorControl.power * powerAdjust),
            front_lights: this.to_ushort_fraction(this.getFrontLights()),
            rear_lights: this.to_ushort_fraction(this.getRearLights()),
            horn: this.boardState.horn ? 523 : 0,
        };
    }
    to_short_fraction(value) {
        return Math.round(value * MAX_SHORT);
    }
    to_ushort_fraction(value) {
        return Math.round(value * MAX_USHORT);
    }
    getFrontLights() {
        switch (this.boardState.lights) {
            case LightsState.on:
                return 0.4;
            case LightsState.high:
                return 1;
            case LightsState.off:
                return 0;
        }
    }
    getRearLights() {
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
    static serializeMotorMode(mode) {
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
};
__decorate([
    property({ type: Object, attribute: false })
], DriveControls.prototype, "webSocket", void 0);
__decorate([
    state()
], DriveControls.prototype, "steering", void 0);
__decorate([
    state()
], DriveControls.prototype, "motorControl", void 0);
__decorate([
    state()
], DriveControls.prototype, "boardState", void 0);
__decorate([
    state()
], DriveControls.prototype, "debug", void 0);
DriveControls = DriveControls_1 = __decorate([
    customElement('drive-controls')
], DriveControls);
export { DriveControls };
const MAX_USHORT = 65535;
const MAX_SHORT = 32767;
//# sourceMappingURL=drive-controls.js.map