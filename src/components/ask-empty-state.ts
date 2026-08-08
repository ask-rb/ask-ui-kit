import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { tokens } from "../styles/tokens.js";

/**
 * A centered empty-state block: a large muted icon (default: cloud with a
 * terminal prompt — override via the `icon` slot), a heading, and any
 * body content (prompt cards, hints) in the default slot.
 */
export class AskEmptyState extends LitElement {
  static styles = css`${tokens}

    :host {
      display: block;
    }

    .empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 1.25rem;
      padding: 2rem 1rem;
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      border-radius: var(--ask-radius-pill, 9999px);
      border: 1px solid var(--ask-border, #e5e5e5);
      color: var(--ask-text-muted, #a3a3a3);
    }
    .icon svg {
      width: 1.75rem;
      height: 1.75rem;
    }

    .heading {
      font-size: 1.75rem;
      font-weight: 400;
      line-height: 1.3;
      color: var(--ask-text, #171717);
      max-width: 30rem;
    }

    .body {
      width: 100%;
      max-width: 52rem;
    }
  `;

  @property({ type: String }) heading = "";

  render() {
    return html`
      <div class="empty">
        <span class="icon" part="icon">
          <slot name="icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17.5 19a4.5 4.5 0 1 0-.42-8.98 6 6 0 1 0-10.55 5.29"/>
              <path d="M8 14l3 3 5-6"/>
            </svg>
          </slot>
        </span>
        ${this.heading ? html`<h2 class="heading">${this.heading}</h2>` : ""}
        <div class="body" part="body"><slot></slot></div>
      </div>
    `;
  }
}

customElements.define("ask-empty-state", AskEmptyState);

declare global {
  interface HTMLElementTagNameMap {
    "ask-empty-state": AskEmptyState;
  }
}
