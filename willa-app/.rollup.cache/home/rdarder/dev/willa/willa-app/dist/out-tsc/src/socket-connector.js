import { __decorate } from "tslib";
import { LitElement, html, } from 'lit';
import { customElement, property } from 'lit/decorators.js';
export class WebSocketConnectorController {
    constructor(host) {
        this.isConnected = false;
        this.isConnecting = false;
        this.hasEverConnected = false;
        this.consecutiveErrors = 0;
        this.wantsToConnect = false;
        this.host = host;
        host.addController(this);
    }
    hostDisconnected() {
        this.disconnect();
    }
    connect() {
        this.wantsToConnect = true;
        if (!this.isConnected) {
            this.establishConnection();
        }
        this.host.requestUpdate();
    }
    disconnect() {
        this.wantsToConnect = false;
        if (this.isConnected) {
            this.websocket.close();
        }
        this.host.requestUpdate();
    }
    establishConnection() {
        // const host = window.location.host;
        this.isConnecting = true;
        const host = 'localhost:5000';
        const ws = new WebSocket(`ws://${host}/controller`);
        ws.onerror = () => {
            this.onConnectionError();
        };
        ws.onopen = (ev) => {
            this.onConnectionOpen(ev);
        };
    }
    onConnectionError() {
        this.isConnected = false;
        this.websocket = undefined;
        this.consecutiveErrors += 1;
        this.host.requestUpdate();
        if (this.wantsToConnect) {
            setTimeout(() => {
                this.establishConnection();
            }, Math.max(this.consecutiveErrors * 1000, 3000));
        }
    }
    onConnectionOpen(ev) {
        if (!this.wantsToConnect) {
            this.disconnect();
        }
        else {
            this.isConnected = true;
            this.hasEverConnected = true;
            this.consecutiveErrors = 0;
            this.websocket = ev.target;
        }
        this.host.requestUpdate();
    }
}
let WebSocketConnector = class WebSocketConnector extends LitElement {
    constructor() {
        super(...arguments);
        this.isConnected = false;
        this.isConnecting = false;
        this.hasEverConnected = false;
        this.consecutiveErrors = 0;
    }
    render() {
        if (this.isConnected) {
            return html `<div>Connected</div>`;
        }
        else if (this.isConnecting) {
            if (this.hasEverConnected) {
                return html `<div>Reconnecting (${this.consecutiveErrors} errors)</div>`;
            }
            else {
                return html `<div>
          Connecting...
          <button @click=${this.clickDisconnect}>Cancel</button>
        </div>`;
            }
        }
        else {
            return html `<div>
        <p>Not Connected</p>
        <button @click=${this.clickConnect}>Connect</button>
      </div>`;
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
    property({ type: Boolean })
], WebSocketConnector.prototype, "isConnected", void 0);
__decorate([
    property({ type: Boolean })
], WebSocketConnector.prototype, "isConnecting", void 0);
__decorate([
    property({ type: Boolean })
], WebSocketConnector.prototype, "hasEverConnected", void 0);
__decorate([
    property({ type: Number })
], WebSocketConnector.prototype, "consecutiveErrors", void 0);
WebSocketConnector = __decorate([
    customElement('websocket-connector')
], WebSocketConnector);
export { WebSocketConnector };
//# sourceMappingURL=socket-connector.js.map