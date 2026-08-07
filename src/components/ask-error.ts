import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { property } from "lit/decorators.js";

export class AskError extends LitElement {
  static styles = css`${tokens}

    :host {
      display: block;
    }

    .error-card {
      display: inline-flex;
      align-items: flex-start;
      gap: var(--ask-radius, 0.5rem);
      padding: 0.625rem 1rem;
      border-radius: 1rem;
      font-size: 0.8125rem;
      line-height: 1.5;
      background: var(--ask-danger-bg, #fef2f2);
      color: var(--ask-danger-text, #991b1b);
      border: 1px solid var(--ask-danger-border, #fecaca);
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
      color: var(--ask-danger-text, #7f1d1d);
    }

    .error-retry {
      margin-top: var(--ask-radius, 0.5rem);
      padding: 0.25rem 0.75rem;
      border-radius: var(--ask-radius-small, 0.375rem);
      border: 1px solid var(--ask-danger-border, #fecaca);
      background: var(--ask-surface, #fff);
      color: var(--ask-danger-text, #991b1b);
      font-size: 0.75rem;
      cursor: pointer;
      transition: background 0.1s;
    }
    .error-retry:hover {
      background: var(--ask-danger-bg, #fef2f2);
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
