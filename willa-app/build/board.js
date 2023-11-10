import { __decorate } from "tslib";
import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './button';
export var LightsState;
(function (LightsState) {
    LightsState[LightsState["on"] = 0] = "on";
    LightsState[LightsState["off"] = 1] = "off";
    LightsState[LightsState["high"] = 2] = "high";
})(LightsState || (LightsState = {}));
export var DriveMode;
(function (DriveMode) {
    DriveMode[DriveMode["handling"] = 0] = "handling";
    DriveMode[DriveMode["race"] = 1] = "race";
})(DriveMode || (DriveMode = {}));
let ControlBoard = class ControlBoard extends LitElement {
    constructor() {
        super(...arguments);
        this.lights = LightsState.off;
        this.horn = false;
        this.race = false;
        this.debug = false;
    }
    static get styles() {
        return css `
      :host {
        margin: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        flex-grow: 1;
      }
      .spacer {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
      }
      .row {
        display: flex;
        flex-direction: row;
      }
    `;
    }
    render() {
        return html `
      <div class="row">
        <toggle-button @touchend=${this.exit} size="medium">
          <icon-exit></icon-exit>
        </toggle-button>
        <toggle-button
          @touchend="${this.toggleRace}"
          ?toggled=${this.race}
          size="medium"
        >
          <icon-race></icon-race>
        </toggle-button>
        <toggle-button
          @touchend=${this.toggleDebug}
          size="medium"
          ?toggled=${this.debug}
        >
          <icon-debug></icon-debug>
        </toggle-button>
      </div>
      <toggle-choices
        @select=${this.lightsChange}
        selected=${LightsState[this.lights]}
      >
        <toggle-button-choice value="off" size="medium">
          <icon-lights-off></icon-lights-off>
        </toggle-button-choice>
        <toggle-button-choice value="on" size="medium">
          <icon-lights-on></icon-lights-on>
        </toggle-button-choice>
        <toggle-button-choice value="high" size="medium">
          <icon-lights-high></icon-lights-high>
        </toggle-button-choice>
      </toggle-choices>
      <div class="spacer"></div>
      <toggle-button
        @touchstart=${this.hornPressed}
        @touchend=${this.hornReleased}
        ?toggled=${this.horn}
        size="large"
      >
        <icon-horn></icon-horn>
      </toggle-button>
    `;
    }
    exit() {
        this.dispatchEvent(new CustomEvent('exit', { bubbles: true, composed: true }));
    }
    hornPressed() {
        this.horn = true;
        navigator.vibrate([200]);
        this.emitChange();
    }
    hornReleased() {
        this.horn = false;
        this.emitChange();
    }
    toggleRace() {
        this.race = !this.race;
        this.emitChange();
    }
    toggleDebug() {
        this.dispatchEvent(new CustomEvent('toggleDebug', { bubbles: true, composed: true }));
    }
    lightsChange(e) {
        this.lights = LightsState[e.detail];
        this.emitChange();
    }
    emitChange() {
        this.dispatchEvent(new CustomEvent('change', {
            detail: {
                horn: this.horn,
                lights: this.lights,
                mode: this.race ? DriveMode.race : DriveMode.handling,
            },
        }));
    }
};
__decorate([
    state()
], ControlBoard.prototype, "lights", void 0);
__decorate([
    state()
], ControlBoard.prototype, "horn", void 0);
__decorate([
    state()
], ControlBoard.prototype, "race", void 0);
__decorate([
    property({ type: Boolean })
], ControlBoard.prototype, "debug", void 0);
ControlBoard = __decorate([
    customElement('control-board')
], ControlBoard);
//# sourceMappingURL=board.js.map