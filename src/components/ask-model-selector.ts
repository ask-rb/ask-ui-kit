import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";

export interface ModelOption {
  label: string;
  value: string;
}

export class AskModelSelector extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .selector-wrapper {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .selector-label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--ask-selector-label, #525252);
      white-space: nowrap;
    }

    .selector-select {
      flex: 1;
      padding: 0.375rem 0.625rem;
      border-radius: 0.5rem;
      border: 1px solid var(--ask-selector-border, #e5e5e5);
      background: var(--ask-selector-bg, #fff);
      color: var(--ask-selector-text, #171717);
      font-size: 0.8125rem;
      font-family: inherit;
      outline: none;
      cursor: pointer;
      min-width: 0;
      appearance: auto;
    }
    .selector-select:focus {
      border-color: var(--ask-selector-focus-border, #a3a3a3);
    }

    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      :host {
        --ask-selector-label: var(--ask-selector-label-dark, #a3a3a3);
        --ask-selector-border: var(--ask-selector-border-dark, #262626);
        --ask-selector-bg: var(--ask-selector-bg-dark, #1a1a1a);
        --ask-selector-text: var(--ask-selector-text-dark, #f5f5f5);
        --ask-selector-focus-border: var(--ask-selector-focus-border-dark, #525252);
      }
    }
    :host-context(.dark) {
      --ask-selector-label: var(--ask-selector-label-dark, #a3a3a3);
      --ask-selector-border: var(--ask-selector-border-dark, #262626);
      --ask-selector-bg: var(--ask-selector-bg-dark, #1a1a1a);
      --ask-selector-text: var(--ask-selector-text-dark, #f5f5f5);
      --ask-selector-focus-border: var(--ask-selector-focus-border-dark, #525252);
    }
    :host-context(.light) {
      --ask-selector-label: var(--ask-selector-label-light, #525252);
      --ask-selector-border: var(--ask-selector-border-light, #e5e5e5);
      --ask-selector-bg: var(--ask-selector-bg-light, #fff);
      --ask-selector-text: var(--ask-selector-text-light, #171717);
      --ask-selector-focus-border: var(--ask-selector-focus-border-light, #a3a3a3);
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
