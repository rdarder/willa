import { __decorate } from "tslib";
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { WebSocketConnectorController } from './socket-connector.js';
let Router = class Router extends LitElement {
    constructor() {
        super(...arguments);
        this.connector = new WebSocketConnectorController(this);
    }
    render() {
        if (this.connector.isConnected) {
            return html `<drive-controls
        .webSocket=${this.connector.websocket}
      ></drive-controls>`;
        }
        else {
            return html `<websocket-connector
        .isConnected=${this.connector.isConnected}
        .isConnecting=${this.connector.isConnecting}
        .hasEverConnected=${this.connector.hasEverConnected}
        .onsecutiveErrors=${this.connector.consecutiveErrors}
        @connect=${() => this.connector.connect()}
        @disconnect="${() => this.connector.disconnect()}"
      ></websocket-connector>`;
        }
    }
};
Router = __decorate([
    customElement('willa-router')
], Router);
export { Router };
//# sourceMappingURL=router.js.map