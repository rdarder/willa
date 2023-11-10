import { __decorate } from "tslib";
import * as flatbuffers from 'flatbuffers';
import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Willa } from './serialization.js';
import { MotorMode } from './motor.js';
import settings from '@settings/default';
export class DriveCommandSender {
    constructor() {
        this.recurringCommand = null;
        this.webSocket = null;
        this.command = {
            steering: 0,
            motorControl: { mode: MotorMode.idle },
        };
        this.sendCommand = () => {
            if (this.webSocket === null) {
                throw new Error('no websocket');
            }
            const builder = new flatbuffers.Builder(100);
            Willa.DriveController.DriveControl.startDriveControl(builder);
            Willa.DriveController.DriveControl.addSteer(builder, this.command.steering);
            Willa.DriveController.DriveControl.addMotorMode(builder, DriveCommandSender.serializeMotorMode(this.command.motorControl.mode));
            if (this.command.motorControl.mode === MotorMode.forward ||
                this.command.motorControl.mode === MotorMode.reverse) {
                Willa.DriveController.DriveControl.addMotorPower(builder, this.command.motorControl.power);
            }
            const endPos = Willa.DriveController.DriveControl.endDriveControl(builder);
            builder.finish(endPos);
            const buf = builder.asUint8Array();
            this.webSocket.send(buf);
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
    updateSteering(steering) {
        this.command.steering = steering;
    }
    updateMotorControl(motorControl) {
        this.command.motorControl = motorControl;
    }
    static serializeMotorMode(mode) {
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
let DriveControls = class DriveControls extends LitElement {
    constructor() {
        super(...arguments);
        this.webSocket = null;
        this.steering = 0;
        this.motorControl = { mode: MotorMode.idle };
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
    `;
    }
    willUpdate(changedProperties) {
        if (changedProperties.has('webSocket')) {
            this.commandSender.disable();
            if (this.webSocket !== null) {
                this.commandSender.enable(this.webSocket);
            }
        }
    }
    render() {
        return html `
      <drive-steering
        .current=${this.steering}
        @change=${this.onSteeringChange}
      ></drive-steering>
      <drive-motor
        .current=${this.motorControl}
        @change=${this.onMotorControlChange}
      ></drive-motor>
    `;
    }
    onSteeringChange(event) {
        this.commandSender.updateSteering(event.detail.steering);
    }
    onMotorControlChange(event) {
        this.commandSender.updateMotorControl(event.detail);
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
DriveControls = __decorate([
    customElement('drive-controls')
], DriveControls);
export { DriveControls };
//# sourceMappingURL=drive-controls.js.map