import { __decorate } from "tslib";
import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { ConnectionStatus, WebSocketConnectorController, } from './socket-connector';
import './socket-connector';
import './drive-controls';
import settings from './settings';
let Router = class Router extends LitElement {
    constructor() {
        super(...arguments);
        this.connector = new WebSocketConnectorController(this);
    }
    firstUpdated(_changedProperties) { }
    static get styles() {
        return css `
      :host {
        display: flex;
        align-items: center;
        flex-grow: 1;
      }
    `;
    }
    render() {
        if (this.connector.status == ConnectionStatus.CONNECTED) {
            return html `<drive-controls
        .webSocket=${this.connector.websocket}
        @exit=${this.driveControlExit}
      ></drive-controls>`;
        }
        else {
            return html `<websocket-connector
        .status=${this.connector.status}
        .consecutiveErrors=${this.connector.consecutiveErrors}
        @connect=${this.connect}
        @disconnect="${() => this.connector.disconnect()}"
      ></websocket-connector>`;
        }
    }
    async driveControlExit() {
        this.connector.disconnect();
        await screen.orientation.unlock();
        if (document.fullscreenElement) {
            await document.exitFullscreen();
        }
    }
    async connect() {
        this.connector.connect();
        if (settings.fullScreen) {
            try {
                await document.documentElement.requestFullscreen();
            }
            catch (e) {
                console.error('Could not set the app in fullscreen', e);
            }
        }
        try {
            await screen.orientation.lock('landscape-primary');
        }
        catch (e) {
            console.error('Could not lock the screen orientation', e);
        }
    }
};
Router = __decorate([
    customElement('willa-router')
], Router);
export { Router };
//# sourceMappingURL=router.js.map