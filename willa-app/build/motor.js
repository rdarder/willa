import { __decorate } from "tslib";
import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { solidColors, translucentColors, transparentColors } from './styles';
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
        this.CANVAS_PIXELS = 300;
        this.canvasWidth = 0;
        this.canvasHeight = 0;
        this.current = { mode: MotorMode.idle, power: 0 };
        this.getTouchArea = (event, current) => {
            const rect = event.target.getBoundingClientRect();
            const x = event.touches[0].clientX - rect.left;
            const y = event.touches[0].clientY - rect.top;
            const aspectRatio = rect.width / rect.height;
            const breakStartY = rect.height * (1 - this.BREAK_AREA);
            const breakStartX = rect.width * (1 - this.BREAK_AREA);
            const isInBrakeZone = x > breakStartX && y > breakStartY;
            if (isInBrakeZone) {
                return { zone: MotorMode.brake };
            }
            // if (x > rect.width || x < 0 || y > rect.height || y < 0) {
            //   return { zone: MotorMode.idle };
            // }
            const powerSide = x / aspectRatio > y ? MotorMode.forward : MotorMode.reverse;
            if (current === MotorMode.forward ||
                (current !== MotorMode.reverse && powerSide === MotorMode.forward)) {
                // if we're in forward mode but the touch is in the reverse zone,
                // we honor the vertical axis of the touch and keep it forward.
                // Equivalent behavior for reverse.
                // For going from forward to reverse, user must go through break or idle.
                return {
                    zone: MotorMode.forward,
                    power: Math.max(0, Math.min(1, (breakStartY - y) / breakStartY)),
                };
            }
            else {
                return {
                    zone: MotorMode.reverse,
                    power: Math.max(0, Math.min(1, (breakStartX - x) / breakStartX)),
                };
            }
        };
    }
    firstUpdated() {
        this.adjustCanvasSize();
        window.addEventListener('resize', this.adjustCanvasSize.bind(this));
    }
    adjustCanvasSize() {
        const container = this.shadowRoot.getElementById('canvas-container');
        const rect = container.getBoundingClientRect();
        this.canvasWidth = Math.floor(rect.width);
        this.canvasHeight = Math.floor(rect.height);
        const canvas = this.shadowRoot.getElementById('canvas');
        canvas.width = this.canvasWidth;
        canvas.height = this.canvasHeight;
        this.requestUpdate();
        this.updateCanvas();
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
                    this.onChange({ mode: MotorMode.brake, power: 0 });
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
                    this.onChange({ mode: MotorMode.idle, power: 0 });
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
                    this.onChange({ mode: MotorMode.idle, power: 0 });
                }
                else if (area.zone === MotorMode.brake) {
                    this.onChange({ mode: MotorMode.brake, power: 0 });
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
                    this.onChange({ mode: MotorMode.idle, power: 0 });
                }
                else if (area.zone === MotorMode.brake) {
                    this.onChange({ mode: MotorMode.brake, power: 0 });
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
        this.onChange({ mode: MotorMode.idle, power: 0 });
    }
    onTouchStart(event) {
        this.onTouchMove(event);
    }
    onChange(control) {
        this.current = control;
        this.dispatchEvent(new CustomEvent('change', { detail: control }));
        requestAnimationFrame(this.updateCanvas.bind(this));
    }
    updateCanvas() {
        const canvas = this.shadowRoot.getElementById('canvas');
        const width = this.canvasWidth;
        const height = this.canvasHeight;
        const ctx = canvas.getContext('2d');
        const breakWidth = width * this.BREAK_AREA;
        const breakHeight = height * this.BREAK_AREA;
        const fwdLength = height - breakHeight;
        const fwdThickness = breakWidth;
        const revLength = width - breakWidth;
        const revThickness = breakHeight;
        ctx.clearRect(0, 0, width, height);
        ctx.save();
        ctx.translate(width, fwdLength);
        ctx.rotate(Math.PI);
        const fwdGradient = ctx.createLinearGradient(0, 0, fwdThickness, fwdLength);
        fwdGradient.addColorStop(0, transparentColors.positive);
        fwdGradient.addColorStop(1, translucentColors.positive);
        ctx.fillStyle = fwdGradient;
        ctx.fillRect(0, 0, fwdThickness, fwdLength);
        if (this.current.mode === MotorMode.forward) {
            ctx.fillStyle = solidColors.positive;
            ctx.fillRect(0, 0, fwdThickness, fwdLength * this.current.power);
        }
        else if (this.current.mode === MotorMode.idle) {
            ctx.fillStyle = solidColors.positive;
            ctx.fillRect(0, 0, fwdThickness, 4);
        }
        ctx.restore();
        ctx.save();
        ctx.translate(revLength, height - breakHeight);
        ctx.rotate(Math.PI / 2);
        const revGradient = ctx.createLinearGradient(0, 0, revThickness, revLength);
        revGradient.addColorStop(0, transparentColors.secondary);
        revGradient.addColorStop(1, translucentColors.secondary);
        ctx.fillStyle = revGradient;
        ctx.fillRect(0, 0, revThickness, revLength);
        if (this.current.mode === MotorMode.reverse) {
            ctx.fillStyle = solidColors.secondary;
            ctx.fillRect(0, 0, revThickness, revLength * this.current.power);
        }
        ctx.restore();
        ctx.save();
        ctx.translate(width, height - breakHeight);
        ctx.rotate(Math.PI / 2);
        if (this.current.mode === MotorMode.brake) {
            ctx.fillStyle = solidColors.negative;
        }
        else {
            ctx.fillStyle = translucentColors.negative;
        }
        ctx.fillRect(0, 0, breakHeight, breakWidth);
        ctx.restore();
    }
    render() {
        const mode = this.current.mode;
        const power = mode === MotorMode.forward || mode === MotorMode.reverse
            ? this.current.power
            : 0;
        return html `
      <style>
        #canvas {
          width: '${this.canvasWidth}px';
          height: '${this.canvasHeight}px';
        }
      </style>
      <div id="canvas-container">
        <canvas
          id="canvas"
          @touchstart=${this.onTouchStart}
          @touchend=${this.onTouchEnd}
          @touchmove=${this.onTouchMove}
        ></canvas>
      </div>
    `;
    }
};
DriveMotor.styles = css `
    :host {
      width: 60%;
      display: flex;
      flex-direction: column;
      align-items: stretch;
      align-self: stretch;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
    #canvas-container {
      align-self: stretch;
      height: 100%;
    }
  `;
__decorate([
    state()
], DriveMotor.prototype, "canvasWidth", void 0);
__decorate([
    state()
], DriveMotor.prototype, "canvasHeight", void 0);
__decorate([
    property({ type: Object })
], DriveMotor.prototype, "current", void 0);
DriveMotor = __decorate([
    customElement('drive-motor')
], DriveMotor);
export { DriveMotor };
//# sourceMappingURL=motor.js.map