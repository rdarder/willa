import { LitElement, html, css, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';

import './router';
import { solidColors } from './styles';

@customElement('willa-app')
export class WillaApp extends LitElement {
  static styles = css`
    :host {
      height: 100vh;
      width: 100vw;
      display: flex;
      font-size: calc(10px + 2vmin);
      background-color: ${unsafeCSS(solidColors.background)};
      color: ${unsafeCSS(solidColors.primary)};
      margin: 0;
      text-align: center;
    }

    main {
      display: flex;
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

  render() {
    return html`
      <header>
        <link rel="icon" href="../assets/favicon.ico" type="image/x-icon" />
      </header>
      <main>
        <willa-router></willa-router>
      </main>
    `;
  }
}
