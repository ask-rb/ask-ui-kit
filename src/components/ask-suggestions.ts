import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";

export class AskSuggestions extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .suggestions-label {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--ask-suggestions-label, #737373);
      margin-bottom: 0.375rem;
    }

    .suggestions-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
    }

    .suggestion-chip {
      padding: 0.375rem 0.75rem;
      border-radius: 9999px;
      border: 1px solid var(--ask-suggestions-border, #e5e5e5);
      background: var(--ask-suggestions-bg, #fff);
      color: var(--ask-suggestions-text, #404040);
      font-size: 0.8125rem;
      cursor: pointer;
      transition: background 0.1s, border-color 0.1s;
      white-space: nowrap;
    }
    .suggestion-chip:hover {
      background: var(--ask-suggestions-hover-bg, #f5f5f5);
      border-color: var(--ask-suggestions-hover-border, #a3a3a3);
    }

    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      :host {
        --ask-suggestions-label: var(--ask-suggestions-label-dark, #525252);
        --ask-suggestions-border: var(--ask-suggestions-border-dark, #262626);
        --ask-suggestions-bg: var(--ask-suggestions-bg-dark, #1a1a1a);
        --ask-suggestions-text: var(--ask-suggestions-text-dark, #e5e5e5);
        --ask-suggestions-hover-bg: var(--ask-suggestions-hover-bg-dark, #262626);
        --ask-suggestions-hover-border: var(--ask-suggestions-hover-border-dark, #525252);
      }
    }
    :host-context(.dark) {
      --ask-suggestions-label: var(--ask-suggestions-label-dark, #525252);
      --ask-suggestions-border: var(--ask-suggestions-border-dark, #262626);
      --ask-suggestions-bg: var(--ask-suggestions-bg-dark, #1a1a1a);
      --ask-suggestions-text: var(--ask-suggestions-text-dark, #e5e5e5);
      --ask-suggestions-hover-bg: var(--ask-suggestions-hover-bg-dark, #262626);
      --ask-suggestions-hover-border: var(--ask-suggestions-hover-border-dark, #525252);
    }
    :host-context(.light) {
      --ask-suggestions-label: var(--ask-suggestions-label-light, #737373);
      --ask-suggestions-border: var(--ask-suggestions-border-light, #e5e5e5);
      --ask-suggestions-bg: var(--ask-suggestions-bg-light, #fff);
      --ask-suggestions-text: var(--ask-suggestions-text-light, #404040);
      --ask-suggestions-hover-bg: var(--ask-suggestions-hover-bg-light, #f5f5f5);
      --ask-suggestions-hover-border: var(--ask-suggestions-hover-border-light, #a3a3a3);
    }
  `;

  @property({ type: String }) suggestions = "";
  @property({ type: String }) label = "Suggestions";

  private _parsedSuggestions(): string[] {
    try {
      const parsed = JSON.parse(this.suggestions);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // fallback: split by comma
    }
    return this.suggestions
      ? this.suggestions.split(",").map((s) => s.trim()).filter(Boolean)
      : [];
  }

  private _handleSelect(suggestion: string) {
    this.dispatchEvent(
      new CustomEvent("ask-select", {
        detail: { suggestion },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const items = this._parsedSuggestions();
    if (items.length === 0) {
      return html``;
    }

    return html`
      <div class="suggestions-label">${this.label}</div>
      <div class="suggestions-list">
        ${items.map(
          (s) => html`
            <button class="suggestion-chip" @click=${() => this._handleSelect(s)}>${s}</button>
          `
        )}
      </div>
    `;
  }
}

customElements.define("ask-suggestions", AskSuggestions);

declare global {
  interface HTMLElementTagNameMap {
    "ask-suggestions": AskSuggestions;
  }
}
