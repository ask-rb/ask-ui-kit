import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { property } from "lit/decorators.js";

export class AskSuggestions extends LitElement {
  static styles = css`${tokens}

    :host {
      display: block;
    }

    .suggestions-label {
      font-size: 0.75rem;
      font-weight: 500;
      color: var(--ask-text-faint, #737373);
      margin-bottom: var(--ask-radius-small, 0.375rem);
    }

    .suggestions-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ask-radius-small, 0.375rem);
    }

    .suggestion-chip {
      padding: var(--ask-radius-small, 0.375rem) 0.75rem;
      border-radius: var(--ask-radius-pill, 9999px);
      border: 1px solid var(--ask-border, #e5e5e5);
      background: var(--ask-surface, #fff);
      color: var(--ask-border-strong, #404040);
      font-size: 0.8125rem;
      cursor: pointer;
      transition: background 0.1s, border-color 0.1s;
      white-space: nowrap;
    }
    .suggestion-chip:hover {
      background: var(--ask-surface-hover, #f5f5f5);
      border-color: var(--ask-text-muted, #a3a3a3);
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
