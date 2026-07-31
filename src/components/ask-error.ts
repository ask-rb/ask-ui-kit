import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";

export class AskError extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .error-card {
      display: inline-flex;
      align-items: flex-start;
      gap: 0.5rem;
      padding: 0.625rem 1rem;
      border-radius: 1rem;
      font-size: 0.8125rem;
      line-height: 1.5;
      background: var(--ask-error-bg, #fef2f2);
      color: var(--ask-error-text, #991b1b);
      border: 1px solid var(--ask-error-border, #fecaca);
    }

    .error-icon {
      flex-shrink: 0;
      font-size: 1rem;
      line-height: 1.25;
    }

    .error-content {
      flex: 1;
      min-width: 0;
    }

    .error-title {
      font-weight: 600;
      font-size: 0.875rem;
    }

    .error-message {
      margin-top: 0.125rem;
      color: var(--ask-error-message, #7f1d1d);
    }

    .error-retry {
      margin-top: 0.5rem;
      padding: 0.25rem 0.75rem;
      border-radius: 0.375rem;
      border: 1px solid var(--ask-error-border, #fecaca);
      background: var(--ask-error-retry-bg, #fff);
      color: var(--ask-error-text, #991b1b);
      font-size: 0.75rem;
      cursor: pointer;
      transition: background 0.1s;
    }
    .error-retry:hover {
      background: var(--ask-error-retry-hover, #fef2f2);
    }

    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      :host {
        --ask-error-bg: var(--ask-error-bg-dark, #450a0a);
        --ask-error-text: var(--ask-error-text-dark, #fca5a5);
        --ask-error-border: var(--ask-error-border-dark, #7f1d1d);
        --ask-error-message: var(--ask-error-message-dark, #fca5a5);
        --ask-error-retry-bg: var(--ask-error-retry-bg-dark, #1a1a1a);
        --ask-error-retry-hover: var(--ask-error-retry-hover-dark, #262626);
      }
    }
    :host-context(.dark) {
      --ask-error-bg: var(--ask-error-bg-dark, #450a0a);
      --ask-error-text: var(--ask-error-text-dark, #fca5a5);
      --ask-error-border: var(--ask-error-border-dark, #7f1d1d);
      --ask-error-message: var(--ask-error-message-dark, #fca5a5);
      --ask-error-retry-bg: var(--ask-error-retry-bg-dark, #1a1a1a);
      --ask-error-retry-hover: var(--ask-error-retry-hover-dark, #262626);
    }
    :host-context(.light) {
      --ask-error-bg: var(--ask-error-bg-light, #fef2f2);
      --ask-error-text: var(--ask-error-text-light, #991b1b);
      --ask-error-border: var(--ask-error-border-light, #fecaca);
      --ask-error-message: var(--ask-error-message-light, #7f1d1d);
      --ask-error-retry-bg: var(--ask-error-retry-bg-light, #fff);
      --ask-error-retry-hover: var(--ask-error-retry-hover-light, #fef2f2);
    }
  `;

  @property({ type: String }) message = "";
  @property({ type: String }) title = "Something went wrong";
  @property({ type: Boolean }) retryable = false;

  private _handleRetry() {
    this.dispatchEvent(
      new CustomEvent("ask-retry", {
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    if (!this.message) {
      return html``;
    }

    return html`
      <div class="error-card">
        <span class="error-icon">⚠️</span>
        <div class="error-content">
          <div class="error-title">${this.title}</div>
          <div class="error-message">${this.message}</div>
          ${this.retryable
            ? html`<button class="error-retry" @click=${this._handleRetry}>Retry</button>`
            : ""
          }
        </div>
      </div>
    `;
  }
}

customElements.define("ask-error", AskError);

declare global {
  interface HTMLElementTagNameMap {
    "ask-error": AskError;
  }
}
