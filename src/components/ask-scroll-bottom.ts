import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { property } from "lit/decorators.js";

export class AskScrollBottom extends LitElement {
  static styles = css`${tokens}

    :host {
      display: block;
      position: sticky;
      bottom: 0;
      z-index: 10;
      pointer-events: none;
    }

    .scroll-btn {
      position: absolute;
      bottom: var(--ask-radius, 0.5rem);
      right: var(--ask-radius, 0.5rem);
      width: 2.25rem;
      height: 2.25rem;
      border-radius: var(--ask-radius-pill, 9999px);
      border: 1px solid var(--ask-border, #e5e5e5);
      background: var(--ask-surface, #fff);
      color: var(--ask-text-faint, #525252);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      cursor: pointer;
      pointer-events: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s ease, transform 0.2s ease;
      opacity: 0;
      transform: translateY(var(--ask-radius, 0.5rem));
    }
    .scroll-btn--visible {
      opacity: 1;
      transform: translateY(0);
    }
    .scroll-btn:hover {
      background: var(--ask-text, #f5f5f5);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .scroll-icon {
      width: 1.125rem;
      height: 1.125rem;
    }

    .scroll-badge {
      position: absolute;
      top: -var(--ask-radius-small, 0.375rem);
      right: -var(--ask-radius-small, 0.375rem);
      min-width: 1.125rem;
      height: 1.125rem;
      border-radius: var(--ask-radius-pill, 9999px);
      background: var(--ask-scroll-badge-bg, #ef4444);
      color: var(--ask-surface, #fff);
      font-size: 0.625rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 0.25rem;
      line-height: 1;
    }

    
    
  `;

  @property({ type: Boolean, reflect: true }) visible = false;
  @property({ type: Number }) badge = 0;

  private _handleClick() {
    this.dispatchEvent(
      new CustomEvent("ask-scroll", {
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <button
        class="scroll-btn ${this.visible ? "scroll-btn--visible" : ""}"
        @click=${this._handleClick}
        aria-label="Scroll to bottom"
        ?hidden=${!this.visible}
      >
        <svg class="scroll-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>
        </svg>
        ${this.badge > 0 ? html`<span class="scroll-badge">${this.badge > 99 ? "99+" : this.badge}</span>` : ""}
      </button>
    `;
  }
}

customElements.define("ask-scroll-bottom", AskScrollBottom);

declare global {
  interface HTMLElementTagNameMap {
    "ask-scroll-bottom": AskScrollBottom;
  }
}
