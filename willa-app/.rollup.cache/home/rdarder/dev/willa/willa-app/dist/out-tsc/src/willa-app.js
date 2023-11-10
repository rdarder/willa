import { __decorate } from "tslib";
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
const favicon = new URL('../../assets/favicon.ico', import.meta.url).href;
let WillaApp = class WillaApp extends LitElement {
    render() {
        return html `
      <header><link rel="icon" href=${favicon}" type="image/x-icon" /></header>
      <main>
        <willa-router></willa-router>
      </main>
    `;
    }
};
WillaApp.styles = css `
    :host {
      height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      font-size: calc(10px + 2vmin);
      color: #1a2b42;
      max-width: 960px;
      margin: 0 auto;
      text-align: center;
      background-color: var(--willa-app-background-color);
    }

    main {
      flex-grow: 1;
    }

    .logo {
      margin-top: 36px;
      flex: 1;
    }

    .app-footer {
      font-size: calc(12px + 0.5vmin);
      align-items: center;
    }

    .app-footer a {
      margin-left: 5px;
    }
  `;
WillaApp = __decorate([
    customElement('willa-app')
], WillaApp);
export { WillaApp };
//# sourceMappingURL=willa-app.js.map