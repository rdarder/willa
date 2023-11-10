import { __decorate } from "tslib";
import { LitElement, css, html, svg, unsafeCSS } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { solidColors, translucentColors } from './styles';
let ToggleButton = class ToggleButton extends LitElement {
    constructor() {
        super(...arguments);
        // display an svg file, with changing colors based on whether it's toggled or not.
        this.toggled = false;
        this.size = 'small';
        this.svgPath = '';
    }
    static get styles() {
        return css `
      .small {
        width: 32px;
        height: 32px;
      }
      .medium {
        width: 64px;
        height: 64px;
      }
      .large {
        width: 128px;
        height: 128px;
      }
      .toggled {
        fill: ${unsafeCSS(solidColors.primary)};
      }
      .untoggled {
        fill: ${unsafeCSS(translucentColors.primary)};
      }
      :host {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        margin: 0;
        padding: 10px 5px 5px;
      }
    `;
    }
    render() {
        return html `
      <div class="${this.toggled ? 'toggled' : 'untoggled'} ${this.size}">
        <slot></slot>
      </div>
    `;
    }
};
__decorate([
    property({ type: Boolean })
], ToggleButton.prototype, "toggled", void 0);
__decorate([
    property({ type: String })
], ToggleButton.prototype, "size", void 0);
__decorate([
    property({ type: String })
], ToggleButton.prototype, "svgPath", void 0);
ToggleButton = __decorate([
    customElement('toggle-button')
], ToggleButton);
export { ToggleButton };
let ToggleChoices = class ToggleChoices extends LitElement {
    constructor() {
        super(...arguments);
        this.selected = '';
    }
    static get styles() {
        return css `
      :host {
        display: flex;
        flex-direction: row;
        padding: 0;
        margin: 0;
        border: 4px solid ${unsafeCSS(translucentColors.primary)};
        border-radius: 10px;
      }
    `;
    }
    firstUpdated(_changedProperties) {
        this.updateSlots();
    }
    render() {
        return html `<slot></slot>`;
    }
    willUpdate(_changedProperties) {
        this.updateSlots();
    }
    updateSlots() {
        var _a;
        const slot = (_a = this.shadowRoot) === null || _a === void 0 ? void 0 : _a.querySelector('slot');
        if (slot) {
            slot.assignedElements({ flatten: true }).forEach((el) => {
                if (el.getAttribute('value') === this.selected) {
                    el.setAttribute('toggled', 'true');
                }
                else {
                    el.removeAttribute('toggled');
                }
            });
        }
    }
};
__decorate([
    property({ type: String })
], ToggleChoices.prototype, "selected", void 0);
ToggleChoices = __decorate([
    customElement('toggle-choices')
], ToggleChoices);
export { ToggleChoices };
let ToggleButtonChoice = class ToggleButtonChoice extends LitElement {
    constructor() {
        super(...arguments);
        this.value = '';
        this.toggled = false;
        this.size = 'small';
    }
    render() {
        return html `<toggle-button
      @click=${this.onClick}
      ?toggled=${this.toggled}
      size=${this.size}
    >
      <slot></slot>
    </toggle-button>`;
    }
    onClick(ev) {
        ev.stopPropagation();
        this.dispatchEvent(new CustomEvent('select', {
            detail: this.value,
            bubbles: true,
            composed: true,
        }));
    }
};
ToggleButtonChoice.styles = css `
    :host {
      display: flex;
      flex-direction: row;
      margin: 0;
      padding: 0;
    }
  `;
__decorate([
    property({ type: String })
], ToggleButtonChoice.prototype, "value", void 0);
__decorate([
    property({ type: Boolean })
], ToggleButtonChoice.prototype, "toggled", void 0);
__decorate([
    property({ type: String })
], ToggleButtonChoice.prototype, "size", void 0);
ToggleButtonChoice = __decorate([
    customElement('toggle-button-choice')
], ToggleButtonChoice);
export { ToggleButtonChoice };
let IconGame = class IconGame extends LitElement {
    render() {
        return svg `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M189-160q-60 0-102.5-43T42-307q0-9 1-18t3-18l84-336q14-54 57-87.5t98-33.5h390q55 0 98 33.5t57 87.5l84 336q2 9 3.5 18.5T919-306q0 61-43.5 103.5T771-160q-42 0-78-22t-54-60l-28-58q-5-10-15-15t-21-5H385q-11 0-21 5t-15 15l-28 58q-18 38-54 60t-78 22Zm3-80q19 0 34.5-10t23.5-27l28-57q15-31 44-48.5t63-17.5h190q34 0 63 18t45 48l28 57q8 17 23.5 27t34.5 10q28 0 48-18.5t21-46.5q0 1-2-19l-84-335q-7-27-28-44t-49-17H285q-28 0-49.5 17T208-659l-84 335q-2 6-2 18 0 28 20.5 47t49.5 19Zm348-280q17 0 28.5-11.5T580-560q0-17-11.5-28.5T540-600q-17 0-28.5 11.5T500-560q0 17 11.5 28.5T540-520Zm80-80q17 0 28.5-11.5T660-640q0-17-11.5-28.5T620-680q-17 0-28.5 11.5T580-640q0 17 11.5 28.5T620-600Zm0 160q17 0 28.5-11.5T660-480q0-17-11.5-28.5T620-520q-17 0-28.5 11.5T580-480q0 17 11.5 28.5T620-440Zm80-80q17 0 28.5-11.5T740-560q0-17-11.5-28.5T700-600q-17 0-28.5 11.5T660-560q0 17 11.5 28.5T700-520Zm-360 60q13 0 21.5-8.5T370-490v-40h40q13 0 21.5-8.5T440-560q0-13-8.5-21.5T410-590h-40v-40q0-13-8.5-21.5T340-660q-13 0-21.5 8.5T310-630v40h-40q-13 0-21.5 8.5T240-560q0 13 8.5 21.5T270-530h40v40q0 13 8.5 21.5T340-460Zm140-20Z"/></svg> `;
    }
};
IconGame = __decorate([
    customElement('icon-game')
], IconGame);
export { IconGame };
let IconHorn = class IconHorn extends LitElement {
    render() {
        return svg `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M709-255H482L369-142q-23 23-56.5 23T256-142L143-255q-23-23-23-57t23-57l112-112v-227l454 453Zm-193-80L335-516v68L199-312l113 113 136-136h68ZM289-785q107-68 231.5-54.5T735-736q90 90 103.5 214.5T784-290l-58-58q45-82 31.5-173.5T678-679q-66-66-157.5-79.5T347-727l-58-58Zm118 118q57-17 115-7t100 52q42 42 51.5 99.5T666-408l-68-68q0-25-7.5-48.5T566-565q-18-18-41.5-26t-49.5-8l-68-68Zm-49 309Z"/></svg>`;
    }
};
IconHorn = __decorate([
    customElement('icon-horn')
], IconHorn);
export { IconHorn };
let IconLightsOff = class IconLightsOff extends LitElement {
    render() {
        return svg `<svg xmlns="http://www.w3.org/2001/svg" viewBox="0 -960 960 960"><path d="M792-56 640-208v128H320v-448L56-792l56-56 736 736-56 56ZM400-160h160v-128L400-448v288Zm240-274-80-80v-30l80-120v-16H394l-80-80h326v-40H274l-34-34v-46h480v240l-80 120v86Zm-160 66Zm17-209Z"/></svg> `;
    }
};
IconLightsOff = __decorate([
    customElement('icon-lights-off')
], IconLightsOff);
export { IconLightsOff };
let IconLightsOn = class IconLightsOn extends LitElement {
    render() {
        return svg `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M320-80v-440l-80-120v-240h480v240l-80 120v440H320Zm160-260q-25 0-42.5-17.5T420-400q0-25 17.5-42.5T480-460q25 0 42.5 17.5T540-400q0 25-17.5 42.5T480-340ZM320-760h320v-40H320v40Zm320 80H320v16l80 120v384h160v-384l80-120v-16ZM480-480Z"/></svg>`;
    }
};
IconLightsOn = __decorate([
    customElement('icon-lights-on')
], IconLightsOn);
export { IconLightsOn };
let IconLightsHigh = class IconLightsHigh extends LitElement {
    render() {
        return svg `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m226-640-86-84 56-58 86 86-56 56Zm214-120v-120h80v120h-80Zm296 120-58-56 86-84 56 56-84 84ZM360-80v-200L240-400v-200h480v200L600-280v200H360Zm80-80h80v-153l120-120v-87H320v87l120 120v153Zm40-180Z"/></svg>`;
    }
};
IconLightsHigh = __decorate([
    customElement('icon-lights-high')
], IconLightsHigh);
export { IconLightsHigh };
let IconExit = class IconExit extends LitElement {
    render() {
        return svg `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z"/></svg>`;
    }
};
IconExit = __decorate([
    customElement('icon-exit')
], IconExit);
export { IconExit };
let IconSettings = class IconSettings extends LitElement {
    render() {
        return svg `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm112-260q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm0-80q-25 0-42.5-17.5T422-480q0-25 17.5-42.5T482-540q25 0 42.5 17.5T542-480q0 25-17.5 42.5T482-420Zm-2-60Zm-40 320h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Z"/></svg>`;
    }
};
IconSettings = __decorate([
    customElement('icon-settings')
], IconSettings);
export { IconSettings };
let IconRace = class IconRace extends LitElement {
    render() {
        return svg `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M295-119q-36-1-68.5-18.5T165-189q-40-48-62.5-114.5T80-440q0-83 31.5-156T197-723q54-54 127-85.5T480-840q83 0 156 32t127 87q54 55 85.5 129T880-433q0 77-25 144t-71 113q-28 28-59 42.5T662-119q-18 0-36-4.5T590-137l-56-28q-12-6-25.5-9t-28.5-3q-15 0-28.5 3t-25.5 9l-56 28q-19 10-37.5 14.5T295-119Zm2-80q9 0 18.5-2t18.5-7l56-28q21-11 43.5-16t45.5-5q23 0 46 5t44 16l57 28q9 5 18 7t18 2q19 0 36-10t34-30q32-38 50-91t18-109q0-134-93-227.5T480-760q-134 0-227 94t-93 228q0 57 18.5 111t51.5 91q17 20 33 28.5t34 8.5Zm183-281Zm0 120q33 0 56.5-23.5T560-440q0-8-1.5-16t-4.5-16l50-67q10 13 17.5 27.5T634-480h82q-15-88-81.5-144T480-680q-88 0-155 56.5T244-480h82q14-54 57-87t97-33q17 0 32 3t29 9l-51 69q-2 0-5-.5t-5-.5q-33 0-56.5 23.5T400-440q0 33 23.5 56.5T480-360Z"/></svg>`;
    }
};
IconRace = __decorate([
    customElement('icon-race')
], IconRace);
export { IconRace };
let IconDebug = class IconDebug extends LitElement {
    render() {
        return svg `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960"><path d="M480-120q-65 0-120.5-32T272-240H160v-80h84q-3-20-3.5-40t-.5-40h-80v-80h80q0-20 .5-40t3.5-40h-84v-80h112q14-23 31.5-43t40.5-35l-64-66 56-56 86 86q28-9 57-9t57 9l88-86 56 56-66 66q23 15 41.5 34.5T688-640h112v80h-84q3 20 3.5 40t.5 40h80v80h-80q0 20-.5 40t-3.5 40h84v80H688q-32 56-87.5 88T480-120Zm0-80q66 0 113-47t47-113v-160q0-66-47-113t-113-47q-66 0-113 47t-47 113v160q0 66 47 113t113 47Zm-80-120h160v-80H400v80Zm0-160h160v-80H400v80Zm80 40Z"/></svg>`;
    }
};
IconDebug = __decorate([
    customElement('icon-debug')
], IconDebug);
export { IconDebug };
//# sourceMappingURL=button.js.map