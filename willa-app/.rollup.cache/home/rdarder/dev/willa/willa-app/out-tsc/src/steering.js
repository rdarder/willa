import { __decorate } from "tslib";
import { LitElement, css, html } from 'lit';
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
    componentDidMount() {
        window.addEventListener('deviceorientation', this.handleOrientation, true);
    }
    componentWillUnmount() {
        window.removeEventListener('deviceorientation', this.handleOrientation, true);
    }
    static get styles() {
        return css `
      :host {
        width: 40%;
      }
    `;
    }
    render() {
        return html `
      <div></div>
        <div>rotation: {this.props.current.toFixed(2)}</div>
      </div>`;
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