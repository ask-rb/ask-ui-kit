import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { property } from "lit/decorators.js";

export interface ModelOption {
  label: string;
  value: string;
}

export class AskModelSelector extends LitElement {
  static styles = css`${tokens}

    :host {
      display: block;
    }

    .selector-wrapper {
      display: flex;
      align-items: center;
      gap: var(--ask-radius, 0.5rem);
    }

    .selector-label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--ask-text-faint, #525252);
      white-space: nowrap;
    }

    .selector-select {
      flex: 1;
      padding: var(--ask-radius-small, 0.375rem) 0.625rem;
      border-radius: var(--ask-radius, 0.5rem);
      border: 1px solid var(--ask-border, #e5e5e5);
      background: var(--ask-surface, #fff);
      color: var(--ask-text, #171717);
      font-size: 0.8125rem;
      font-family: inherit;
      outline: none;
      cursor: pointer;
      min-width: 0;
      appearance: auto;
    }
    .selector-select:focus {
      border-color: var(--ask-text-muted, #a3a3a3);
    }

    
    
  `;

  @property({ type: String }) options = "";
  @property({ type: String }) value = "";
  @property({ type: String }) label = "";

  private _parsedOptions(): ModelOption[] {
    try {
      const parsed = JSON.parse(this.options);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // ignore
    }
    return [];
  }

  private _handleChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this.value = select.value;
    this.dispatchEvent(
      new CustomEvent("ask-change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const items = this._parsedOptions();

    return html`
      <div class="selector-wrapper">
        ${this.label ? html`<span class="selector-label">${this.label}</span>` : ""}
        <select class="selector-select" @change=${this._handleChange} .value=${this.value}>
          ${items.map(
            (opt) => html`
              <option value=${opt.value} ?selected=${opt.value === this.value}>${opt.label}</option>
            `
          )}
        </select>
      </div>
    `;
  }
}

customElements.define("ask-model-selector", AskModelSelector);

declare global {
  interface HTMLElementTagNameMap {
    "ask-model-selector": AskModelSelector;
  }
}
