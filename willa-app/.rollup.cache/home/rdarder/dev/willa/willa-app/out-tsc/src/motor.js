import { __decorate } from "tslib";
import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
export var MotorMode;
(function (MotorMode) {
    MotorMode["idle"] = "idle";
    MotorMode["brake"] = "brake";
    MotorMode["forward"] = "forward";
    MotorMode["reverse"] = "reverse";
})(MotorMode || (MotorMode = {}));
let DriveMotor = class DriveMotor extends LitElement {
    constructor() {
        super(...arguments);
        this.BREAK_AREA = 0.2;
        this.MAX_OUT_AREA = 0.05;
        this.current = { mode: MotorMode.idle };
        this.getTouchArea = (event, current) => {
            const rect = event.target.getBoundingClientRect();
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
            const powerSide = x / aspectRatio < y ? MotorMode.forward : MotorMode.reverse;
            if (current === MotorMode.forward ||
                (current !== MotorMode.reverse && powerSide === MotorMode.forward)) {
                // if we're in forward mode but the touch is in the reverse zone,
                // we honor the vertical axis of the touch and keep it forward.
                // Equivalent behavior for reverse.
                // For going from forward to reverse, user must go through break or idle.
                return {
                    zone: MotorMode.forward,
                    power: Math.max(0, Math.min(1, (breakStartX - x) / (breakStartX - maxOutX))),
                };
            }
            else {
                return {
                    zone: MotorMode.reverse,
                    power: Math.max(0, Math.min(1, (breakStartY - y) / (breakStartY - maxOutY))),
                };
            }
        };
    }
    onTouchMove(event) {
        const mode = this.current.mode;
        const area = this.getTouchArea(event, mode);
        switch (mode) {
            case MotorMode.idle:
                if (area.zone === MotorMode.idle) {
                    break;
                }
                else if (area.zone === MotorMode.brake) {
                    this.onChange({ mode: MotorMode.brake });
                }
                else if (area.zone === MotorMode.forward) {
                    this.onChange({ mode: MotorMode.forward, power: area.power });
                }
                else if (area.zone === MotorMode.reverse) {
                    this.onChange({ mode: MotorMode.reverse, power: area.power });
                }
                else {
                    throw new Error('unknown touch area for state');
                }
                break;
            case MotorMode.brake:
                if (area.zone === MotorMode.idle) {
                    this.onChange({ mode: MotorMode.idle });
                }
                else if (area.zone === MotorMode.brake) {
                    break;
                }
                else if (area.zone === MotorMode.forward) {
                    this.onChange({ mode: MotorMode.forward, power: area.power });
                }
                else if (area.zone === MotorMode.reverse) {
                    this.onChange({ mode: MotorMode.reverse, power: area.power });
                }
                else {
                    throw new Error('unknown touch area for state');
                }
                break;
            case MotorMode.forward:
                if (area.zone === MotorMode.idle) {
                    this.onChange({ mode: MotorMode.idle });
                }
                else if (area.zone === MotorMode.brake) {
                    this.onChange({ mode: MotorMode.brake });
                }
                else if (area.zone === MotorMode.forward) {
                    this.onChange({ mode: MotorMode.forward, power: area.power });
                }
                else if (area.zone === MotorMode.reverse) {
                    break;
                }
                else {
                    throw new Error('unknown touch area for state');
                }
                break;
            case MotorMode.reverse:
                if (area.zone === MotorMode.idle) {
                    this.onChange({ mode: MotorMode.idle });
                }
                else if (area.zone === MotorMode.brake) {
                    this.onChange({ mode: MotorMode.brake });
                }
                else if (area.zone === MotorMode.forward) {
                    break;
                }
                else if (area.zone === MotorMode.reverse) {
                    this.onChange({ mode: MotorMode.reverse, power: area.power });
                }
                else {
                    throw new Error('unknown touch area for state');
                }
                break;
            default:
                throw new Error('unknown power mode');
        }
    }
    onTouchEnd() {
        this.onChange({ mode: MotorMode.idle });
    }
    onTouchStart(event) {
        this.onTouchMove(event);
    }
    onChange(control) {
        this.current = control;
        this.dispatchEvent(new CustomEvent('change'));
    }
    render() {
        const mode = this.current.mode;
        const power = mode === MotorMode.forward || mode === MotorMode.reverse
            ? this.current.power
            : 0;
        return html `<div
      @touchstart=${this.onTouchStart}
      @touchend=${this.onTouchEnd}
      @touchmove=${this.onTouchMove}
    >
      <div>Mode: ${mode}</div>
      <div>Power: ${power.toFixed(2)}</div>
    </div>`;
    }
};
DriveMotor.styles = css `
    :host {
      border: 1px solid black;
      width: 60%;
      background-color: #fafafa;
    }
  `;
__decorate([
    property({ type: Object })
], DriveMotor.prototype, "current", void 0);
DriveMotor = __decorate([
    customElement('drive-motor')
], DriveMotor);
export { DriveMotor };
//# sourceMappingURL=motor.js.map