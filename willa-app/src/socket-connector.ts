import {
  LitElement,
  ReactiveController,
  ReactiveControllerHost,
  TemplateResult,
  css,
  html,
} from 'lit';
import { customElement, property } from 'lit/decorators.js';
import settings from './settings';

export enum ConnectionStatus {
  DISCONNECTED = 'Disconnected',
  CONNECTING = 'Connecting',
  CONNECTED = 'Connected',
}

export class WebSocketConnectorController implements ReactiveController {
  host: ReactiveControllerHost;

  status: ConnectionStatus = ConnectionStatus.DISCONNECTED;
  private wantsToConnect: boolean = false;
  private connectionAttempt?: number;
  consecutiveErrors: number = 0;
  websocket?: WebSocket;

  constructor(host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);
  }
  hostDisconnected(): void {
    this.disconnect();
  }

  connect(): void {
    this.wantsToConnect = true;
    this.onChange();
  }
  disconnect(): void {
    this.wantsToConnect = false;
    this.onChange();
  }

  private onChange() {
    if (this.wantsToConnect) {
      if (this.status === ConnectionStatus.DISCONNECTED) {
        this.status = ConnectionStatus.CONNECTING;
        this.scheduleWebSocketConnection();
      }
    } else {
      if (this.status === ConnectionStatus.CONNECTING) {
        this.status = ConnectionStatus.DISCONNECTED;
        this.abortConnection();
      } else if (this.status === ConnectionStatus.CONNECTED) {
        this.status = ConnectionStatus.DISCONNECTED;
        this.abortConnection();
      }
    }
    this.host.requestUpdate();
  }
  private abortConnection(): void {
    if (this.websocket) {
      this.websocket.close();
    }
    if (this.connectionAttempt) {
      window.clearTimeout(this.connectionAttempt);
    }
  }

  private scheduleWebSocketConnection(): void {
    // schedule a connection waiting 1 second per consecutive error, up to max 3 seconds between attempt.
    this.connectionAttempt = window.setTimeout(() => {
      this.connectWebSocket();
    }, Math.min(this.consecutiveErrors * 1000, 3000));
  }

  private connectWebSocket(): void {
    // const host = window.location.host;
    const host = settings.getWebSocketHost();
    const connectTimeout = window.setTimeout(() => {
      console.log('ws timeout');
      this.websocket?.close();
      // onclose will account for the error.
    }, 5000);
    this.websocket = new WebSocket(`ws://${host}/controller`);
    const onError = (onerror = () => {
      console.log('ws error');
      if (this.websocket) {
        this.websocket.onclose = null;
        this.websocket.close();
      }
      this.status = ConnectionStatus.DISCONNECTED;
      this.consecutiveErrors++;
      window.clearTimeout(connectTimeout);
      this.onChange();
    });
    this.websocket!.onerror = onError;
    this.websocket!.onclose = onError;
    this.websocket!.onopen = (ev: Event) => {
      this.status = ConnectionStatus.CONNECTED;
      window.clearTimeout(connectTimeout);
      this.consecutiveErrors = 0;
      this.onChange();
    };
  }
}

@customElement('websocket-connector')
export class WebSocketConnector extends LitElement {
  @property({ type: String })
  status: ConnectionStatus = ConnectionStatus.DISCONNECTED;

  @property({ type: Number })
  consecutiveErrors: number = 0;

  static get styles() {
    return css`
      :host {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        align-items: center;
        justify-content: center;
      }
    `;
  }

  protected errorCount() {
    if (this.consecutiveErrors > 0) {
      return html`<div>${this.consecutiveErrors} errors</div>`;
    }
  }
  protected render(): TemplateResult {
    switch (this.status) {
      case ConnectionStatus.CONNECTED:
        return html`<div>Connected</div>`;
      case ConnectionStatus.CONNECTING:
        return html`
          <div>Connecting...</div>
          <div>${this.errorCount()}</div>
          <button @click=${this.clickDisconnect}>Cancel</button>
        `;
      case ConnectionStatus.DISCONNECTED:
        return html`
          <toggle-button @touchend=${this.clickConnect} size="large">
            <icon-game></icon-game>
          </toggle-button>
        `;
    }
  }

  clickConnect(): void {
    this.dispatchEvent(new CustomEvent('connect'));
  }
  clickDisconnect(): void {
    this.dispatchEvent(new CustomEvent('disconnect'));
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'websocket-connector': WebSocketConnector;
  }
}
