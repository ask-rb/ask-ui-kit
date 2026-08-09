import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { property, state } from "lit/decorators.js";

export class AskCodeBlock extends LitElement {
  static styles = css`${tokens}

    :host {
      display: block;
    }

    .code-wrapper {
      position: relative;
      background: var(--ask-surface-muted, #f5f5f5);
      border: 1px solid var(--ask-border, #e5e5e5);
      border-radius: var(--ask-radius, 0.5rem);
      overflow: hidden;
    }

    .code-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--ask-radius-small, 0.375rem) 0.75rem;
      font-size: 0.75rem;
      color: var(--ask-text-faint, #737373);
      background: var(--ask-border, #e5e5e5);
      border-bottom: 1px solid var(--ask-border, #e5e5e5);
    }

    .code-language {
      font-weight: 500;
      font-family: monospace;
      text-transform: lowercase;
    }

    .code-copy-btn {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.125rem var(--ask-radius, 0.5rem);
      border-radius: 0.25rem;
      border: 1px solid var(--ask-border, #e5e5e5);
      background: var(--ask-surface, #fff);
      color: var(--ask-text-faint, #525252);
      font-size: 0.75rem;
      cursor: pointer;
      transition: background 0.1s, opacity 0.1s;
      opacity: 0;
    }
    .code-wrapper:hover .code-copy-btn {
      opacity: 1;
    }
    .code-copy-btn:hover {
      background: var(--ask-border, #e5e5e5);
    }

    .code-body {
      overflow-x: auto;
      padding: 0.75rem 1rem;
      font-family: "SF Mono", Monaco, Menlo, monospace;
      font-size: 0.8125rem;
      line-height: 1.6;
      color: var(--ask-border-strong, #404040);
      white-space: pre;
    }

    
    
  `;

  @property({ type: String }) code = "";
  @property({ type: String }) language = "";

  @state() private _copied = false;

  private async _handleCopy() {
    try {
      await navigator.clipboard.writeText(this.code);
      this._copied = true;
      setTimeout(() => {
        this._copied = false;
      }, 2000);
    } catch {
      // clipboard not available
    }
  }

  render() {
    if (!this.code) {
      return html``;
    }

    return html`
      <div class="code-wrapper">
        <div class="code-header">
          <span class="code-language">${this.language || "code"}</span>
          <button class="code-copy-btn" @click=${this._handleCopy}>
            ${this._copied ? "✅" : "📋"} ${this._copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre class="code-body"><code>${this.code}</code></pre>
      </div>
    `;
  }
}

customElements.define("ask-code-block", AskCodeBlock);

declare global {
  interface HTMLElementTagNameMap {
    "ask-code-block": AskCodeBlock;
  }
}
