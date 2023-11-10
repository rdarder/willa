import { LitElement, css, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export interface SteeringChange {
  steering: number;
}

@customElement('drive-steering')
export class DriveSteering extends LitElement {
  MAX_OUT_ANGLE = 60;

  @property({ type: Number })
  current: number = 0;

  connectedCallback(): void {
    window.addEventListener('deviceorientation', this.handleOrientation, true);
  }
  disconnectedCallback(): void {
    window.removeEventListener(
      'deviceorientation',
      this.handleOrientation,
      true
    );
  }

  handleOrientation = (event: DeviceOrientationEvent) => {
    const current = Math.min(1, Math.max(-1, event.beta! / this.MAX_OUT_ANGLE));
    this.dispatchEvent(
      new CustomEvent('change', { detail: { steering: current } })
    );
  };

  render() {
    return null;
  }
}
