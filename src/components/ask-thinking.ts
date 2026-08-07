import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { property } from "lit/decorators.js";

export class AskThinking extends LitElement {
  static styles = css`${tokens}

    :host {
      display: block;
    }

    /* Header / trigger bar */
    .thinking-header {
      display: flex;
      align-items: center;
      gap: var(--ask-radius-small, 0.375rem);
      cursor: pointer;
      user-select: none;
      padding: var(--ask-radius-small, 0.375rem) var(--ask-radius, 0.5rem);
      border-radius: var(--ask-radius, 0.5rem);
      font-size: 0.875rem;
      line-height: 1.75;
      color: var(--ask-text-faint, #737373);
      transition: background-color 0.15s ease;
    }
    .thinking-header:hover {
      background: var(--ask-thinking-hover-bg, rgba(0, 0, 0, 0.04));
    }

    .thinking-label {
      font-weight: 500;
    }

    /* Chevron (non-streaming) */
    .chevron {
      font-size: 0.75rem;
      opacity: 0.6;
      transition: transform 0.2s ease;
    }
    .chevron--open {
      transform: rotate(90deg);
    }

    /* Animated dots (streaming) — openchamber style */
    @keyframes thinking-dot {
      0%, 80%, 100% { opacity: 0.2; transform: translateY(0); }
      40% { opacity: 1; transform: translateY(-2px); }
    }
    .thinking-dots {
      display: inline-flex;
      gap: 2px;
      line-height: 1;
      color: inherit;
      align-items: center;
    }
    .thinking-dot {
      animation: thinking-dot 1.2s ease-in-out infinite;
      display: inline-block;
    }

    /* Collapsible body — grid-template-rows for smooth height animation */
    .thinking-body {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 0.3s ease, opacity 0.2s ease;
      opacity: 0;
    }
    .thinking-body--expanded {
      grid-template-rows: 1fr;
      opacity: 1;
    }
    .thinking-body-inner {
      overflow: hidden;
      font-size: 0.875rem;
      line-height: 1.75;
      color: var(--ask-text-faint, #737373);
      padding-left: 1rem;
      padding-bottom: var(--ask-radius, 0.5rem);
      margin-left: 0.25rem;
      white-space: pre-wrap;
      border-left: 2px solid var(--ask-border, #e5e5e5);
    }

    
    
  `;

  @property({ type: String }) content = "";
  @property({ type: String }) label = "Thought";
  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: Boolean, reflect: true }) streaming = false;

  private _handleToggle() {
    if (this.streaming) return; // Don't toggle during streaming
    this.open = !this.open;
    this.dispatchEvent(
      new CustomEvent("ask-toggle", {
        detail: { open: this.open },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      this._handleToggle();
    }
  }

  render() {
    const hasContent = this.content && this.content.length > 0;
    const isOpen = this.streaming || this.open;

    // Don't render anything when there's no content and not streaming
    if (!hasContent && !this.streaming) {
      return html``;
    }

    return html`
      <div
        class="thinking-header"
        @click=${this._handleToggle}
        role="button"
        tabindex="0"
        aria-expanded=${isOpen}
        @keydown=${this._handleKeydown}
      >
        ${this.streaming
          ? html`<span class="thinking-dots">
              <span class="thinking-dot" style="animation-delay:0ms">.</span>
              <span class="thinking-dot" style="animation-delay:200ms">.</span>
              <span class="thinking-dot" style="animation-delay:400ms">.</span>
            </span>`
          : ""
        }
        <span class="thinking-label">${this.label}</span>
        ${!this.streaming
          ? html`<span class="chevron ${isOpen ? "chevron--open" : ""}">▸</span>`
          : ""
        }
      </div>
      <div class="thinking-body ${isOpen ? "thinking-body--expanded" : ""}">
        <div class="thinking-body-inner">${this.content}</div>
      </div>
    `;
  }
}

customElements.define("ask-thinking", AskThinking);

declare global {
  interface HTMLElementTagNameMap {
    "ask-thinking": AskThinking;
  }
}
