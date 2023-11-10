import { __decorate } from "tslib";
import { LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
let DriveSteering = class DriveSteering extends LitElement {
    constructor() {
        super(...arguments);
        this.MAX_OUT_ANGLE = 60;
        this.current = 0;
        this.handleOrientation = (event) => {
            const current = Math.min(1, Math.max(-1, event.beta / this.MAX_OUT_ANGLE));
            this.dispatchEvent(new CustomEvent('change', { detail: { steering: current } }));
        };
    }
    connectedCallback() {
        window.addEventListener('deviceorientation', this.handleOrientation, true);
    }
    disconnectedCallback() {
        window.removeEventListener('deviceorientation', this.handleOrientation, true);
    }
    render() {
        return null;
    }
};
__decorate([
    property({ type: Number })
], DriveSteering.prototype, "current", void 0);
DriveSteering = __decorate([
    customElement('drive-steering')
], DriveSteering);
export { DriveSteering };
//# sourceMappingURL=steering.js.map