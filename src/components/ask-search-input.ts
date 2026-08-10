import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { property } from "lit/decorators.js";

/**
 * AskSearchInput — a filter/search input with icon and clear button.
 *
 *   <ask-search-input placeholder="Filter conversations…"></ask-search-input>
 *
 * Emits `search-input` with the current value on every change.
 *
 * Events:
 *   search-input  { value }
 */
export class AskSearchInput extends LitElement {
  static styles = css`${tokens}

    :host {
      display: block;
    }

    .wrap {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.625rem;
      border-radius: 0.625rem;
      border: 1px solid var(--ask-border, #e5e5e5);
      background: var(--ask-surface-muted, #fafafa);
      color: var(--ask-text-muted, #a3a3a3);
      transition: border-color 0.15s;
    }
    .wrap:focus-within {
      border-color: var(--ask-focus, #a3a3a3);
    }

    .icon {
      flex-shrink: 0;
      display: inline-flex;
    }

    input {
      flex: 1;
      min-width: 0;
      border: none;
      outline: none;
      background: transparent;
      font: inherit;
      font-size: 0.8125rem;
      color: var(--ask-text, #171717);
    }
    input::placeholder {
      color: var(--ask-text-muted, #a3a3a3);
    }

    .clear {
      flex-shrink: 0;
      width: 1.25rem;
      height: 1.25rem;
      border: none;
      border-radius: 0.375rem;
      background: transparent;
      color: var(--ask-text-muted, #a3a3a3);
      font-size: 0.75rem;
      cursor: pointer;
      display: none;
    }
    .clear--visible {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .clear:hover {
      background: var(--ask-surface-active, #e5e5e5);
    }
  `;

  @property({ type: String }) value = "";
  @property({ type: String }) placeholder = "Search…";

  render() {
    return html`
      <div class="wrap">
        <span class="icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.5" y2="16.5" />
          </svg>
        </span>
        <input
          .value=${this.value}
          placeholder=${this.placeholder}
          @input=${this._onInput}
        />
        <button
          class="clear ${this.value ? "clear--visible" : ""}"
          @click=${this._clear}
          aria-label="Clear search"
        >✕</button>
      </div>
    `;
  }

  private _onInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    this.dispatchEvent(new CustomEvent("search-input", { detail: { value: this.value }, bubbles: true, composed: true }));
  }

  private _clear() {
    this.value = "";
    this.dispatchEvent(new CustomEvent("search-input", { detail: { value: "" }, bubbles: true, composed: true }));
  }
}

customElements.define("ask-search-input", AskSearchInput);
