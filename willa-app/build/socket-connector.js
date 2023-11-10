import { __decorate } from "tslib";
import { LitElement, css, html, } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import settings from './settings';
export var ConnectionStatus;
(function (ConnectionStatus) {
    ConnectionStatus["DISCONNECTED"] = "Disconnected";
    ConnectionStatus["CONNECTING"] = "Connecting";
    ConnectionStatus["CONNECTED"] = "Connected";
})(ConnectionStatus || (ConnectionStatus = {}));
export class WebSocketConnectorController {
    constructor(host) {
        this.status = ConnectionStatus.DISCONNECTED;
        this.wantsToConnect = false;
        this.consecutiveErrors = 0;
        this.host = host;
        host.addController(this);
    }
    hostDisconnected() {
        this.disconnect();
    }
    connect() {
        this.wantsToConnect = true;
        this.onChange();
    }
    disconnect() {
        this.wantsToConnect = false;
        this.onChange();
    }
    onChange() {
        if (this.wantsToConnect) {
            if (this.status === ConnectionStatus.DISCONNECTED) {
                this.status = ConnectionStatus.CONNECTING;
                this.scheduleWebSocketConnection();
            }
        }
        else {
            if (this.status === ConnectionStatus.CONNECTING) {
                this.status = ConnectionStatus.DISCONNECTED;
                this.abortConnection();
            }
            else if (this.status === ConnectionStatus.CONNECTED) {
                this.status = ConnectionStatus.DISCONNECTED;
                this.abortConnection();
            }
        }
        this.host.requestUpdate();
    }
    abortConnection() {
        if (this.websocket) {
            this.websocket.close();
        }
        if (this.connectionAttempt) {
            window.clearTimeout(this.connectionAttempt);
        }
    }
    scheduleWebSocketConnection() {
        // schedule a connection waiting 1 second per consecutive error, up to max 3 seconds between attempt.
        this.connectionAttempt = window.setTimeout(() => {
            this.connectWebSocket();
        }, Math.min(this.consecutiveErrors * 1000, 3000));
    }
    connectWebSocket() {
        // const host = window.location.host;
        const host = settings.getWebSocketHost();
        const connectTimeout = window.setTimeout(() => {
            var _a;
            console.log('ws timeout');
            (_a = this.websocket) === null || _a === void 0 ? void 0 : _a.close();
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
        this.websocket.onerror = onError;
        this.websocket.onclose = onError;
        this.websocket.onopen = (ev) => {
            this.status = ConnectionStatus.CONNECTED;
            window.clearTimeout(connectTimeout);
            this.consecutiveErrors = 0;
            this.onChange();
        };
    }
}
let WebSocketConnector = class WebSocketConnector extends LitElement {
    constructor() {
        super(...arguments);
        this.status = ConnectionStatus.DISCONNECTED;
        this.consecutiveErrors = 0;
    }
    static get styles() {
        return css `
      :host {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        align-items: center;
        justify-content: center;
      }
    `;
    }
    errorCount() {
        if (this.consecutiveErrors > 0) {
            return html `<div>${this.consecutiveErrors} errors</div>`;
        }
    }
    render() {
        switch (this.status) {
            case ConnectionStatus.CONNECTED:
                return html `<div>Connected</div>`;
            case ConnectionStatus.CONNECTING:
                return html `
          <div>Connecting...</div>
          <div>${this.errorCount()}</div>
          <button @click=${this.clickDisconnect}>Cancel</button>
        `;
            case ConnectionStatus.DISCONNECTED:
                return html `
          <toggle-button @touchend=${this.clickConnect} size="large">
            <icon-game></icon-game>
          </toggle-button>
        `;
        }
    }
    clickConnect() {
        this.dispatchEvent(new CustomEvent('connect'));
    }
    clickDisconnect() {
        this.dispatchEvent(new CustomEvent('disconnect'));
    }
};
__decorate([
    property({ type: String })
], WebSocketConnector.prototype, "status", void 0);
__decorate([
    property({ type: Number })
], WebSocketConnector.prototype, "consecutiveErrors", void 0);
WebSocketConnector = __decorate([
    customElement('websocket-connector')
], WebSocketConnector);
export { WebSocketConnector };
//# sourceMappingURL=socket-connector.js.map