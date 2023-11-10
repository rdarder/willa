import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import './button';

export enum LightsState {
  on,
  off,
  high,
}
export enum DriveMode {
  handling,
  race,
}

export interface BoardState {
  lights: LightsState;
  horn: boolean;
  mode: DriveMode;
}

@customElement('control-board')
class ControlBoard extends LitElement {
  @state()
  lights: LightsState = LightsState.off;
  @state()
  horn: boolean = false;
  @state()
  race: boolean = false;
  @property({ type: Boolean })
  debug: boolean = false;

  static get styles() {
    return css`
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
    return html`
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
  private exit() {
    this.dispatchEvent(
      new CustomEvent('exit', { bubbles: true, composed: true })
    );
  }
  private hornPressed() {
    this.horn = true;
    navigator.vibrate([200]);
    this.emitChange();
  }
  private hornReleased() {
    this.horn = false;
    this.emitChange();
  }

  private toggleRace() {
    this.race = !this.race;
    this.emitChange();
  }

  private toggleDebug() {
    this.dispatchEvent(
      new CustomEvent('toggleDebug', { bubbles: true, composed: true })
    );
  }

  private lightsChange(e: CustomEvent) {
    this.lights = LightsState[e.detail as keyof typeof LightsState];
    this.emitChange();
  }
  private emitChange() {
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: {
          horn: this.horn,
          lights: this.lights,
          mode: this.race ? DriveMode.race : DriveMode.handling,
        },
      })
    );
  }
}
