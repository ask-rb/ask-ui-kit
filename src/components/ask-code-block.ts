import { LitElement, html, css } from "lit";
import { property, state } from "lit/decorators.js";

export class AskCodeBlock extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .code-wrapper {
      position: relative;
      background: var(--ask-code-bg, #f5f5f5);
      border: 1px solid var(--ask-code-border, #e5e5e5);
      border-radius: 0.5rem;
      overflow: hidden;
    }

    .code-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.375rem 0.75rem;
      font-size: 0.75rem;
      color: var(--ask-code-header-text, #737373);
      background: var(--ask-code-header-bg, #e5e5e5);
      border-bottom: 1px solid var(--ask-code-border, #e5e5e5);
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
      padding: 0.125rem 0.5rem;
      border-radius: 0.25rem;
      border: 1px solid var(--ask-code-border, #e5e5e5);
      background: var(--ask-code-btn-bg, #fff);
      color: var(--ask-code-btn-text, #525252);
      font-size: 0.75rem;
      cursor: pointer;
      transition: background 0.1s, opacity 0.1s;
      opacity: 0;
    }
    .code-wrapper:hover .code-copy-btn {
      opacity: 1;
    }
    .code-copy-btn:hover {
      background: var(--ask-code-btn-hover-bg, #e5e5e5);
    }

    .code-body {
      overflow-x: auto;
      padding: 0.75rem 1rem;
      font-family: "SF Mono", Monaco, Menlo, monospace;
      font-size: 0.8125rem;
      line-height: 1.6;
      color: var(--ask-code-text, #404040);
      white-space: pre;
    }

    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      :host {
        --ask-code-bg: var(--ask-code-bg-dark, #1a1a1a);
        --ask-code-border: var(--ask-code-border-dark, #262626);
        --ask-code-header-bg: var(--ask-code-header-bg-dark, #141414);
        --ask-code-header-text: var(--ask-code-header-text-dark, #a3a3a3);
        --ask-code-text: var(--ask-code-text-dark, #e5e5e5);
        --ask-code-btn-bg: var(--ask-code-btn-bg-dark, #262626);
        --ask-code-btn-text: var(--ask-code-btn-text-dark, #a3a3a3);
        --ask-code-btn-hover-bg: var(--ask-code-btn-hover-bg-dark, #333);
      }
    }
    :host-context(.dark) {
      --ask-code-bg: var(--ask-code-bg-dark, #1a1a1a);
      --ask-code-border: var(--ask-code-border-dark, #262626);
      --ask-code-header-bg: var(--ask-code-header-bg-dark, #141414);
      --ask-code-header-text: var(--ask-code-header-text-dark, #a3a3a3);
      --ask-code-text: var(--ask-code-text-dark, #e5e5e5);
      --ask-code-btn-bg: var(--ask-code-btn-bg-dark, #262626);
      --ask-code-btn-text: var(--ask-code-btn-text-dark, #a3a3a3);
      --ask-code-btn-hover-bg: var(--ask-code-btn-hover-bg-dark, #333);
    }
    :host-context(.light) {
      --ask-code-bg: var(--ask-code-bg-light, #f5f5f5);
      --ask-code-border: var(--ask-code-border-light, #e5e5e5);
      --ask-code-header-bg: var(--ask-code-header-bg-light, #e5e5e5);
      --ask-code-header-text: var(--ask-code-header-text-light, #737373);
      --ask-code-text: var(--ask-code-text-light, #404040);
      --ask-code-btn-bg: var(--ask-code-btn-bg-light, #fff);
      --ask-code-btn-text: var(--ask-code-btn-text-light, #525252);
      --ask-code-btn-hover-bg: var(--ask-code-btn-hover-bg-light, #e5e5e5);
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
