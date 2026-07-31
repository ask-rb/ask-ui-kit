import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";

export class AskStreaming extends LitElement {
  static styles = css`
    :host {
      display: block;
    }
    :host([hidden]) {
      display: none;
    }

    .streaming-content {
      font-size: 0.875rem;
      line-height: 1.75;
      color: var(--ask-streaming-text, #171717);
      white-space: pre-wrap;
    }

    .streaming-cursor {
      display: inline-block;
      animation: ask-blink 1s step-end infinite;
      color: var(--ask-streaming-cursor, #737373);
    }

    @keyframes ask-blink {
      50% { opacity: 0; }
    }

    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      :host {
        --ask-streaming-text: var(--ask-streaming-text-dark, #f5f5f5);
        --ask-streaming-cursor: var(--ask-streaming-cursor-dark, #a3a3a3);
      }
    }
    :host-context(.dark) {
      --ask-streaming-text: var(--ask-streaming-text-dark, #f5f5f5);
      --ask-streaming-cursor: var(--ask-streaming-cursor-dark, #a3a3a3);
    }
    :host-context(.light) {
      --ask-streaming-text: var(--ask-streaming-text-light, #171717);
      --ask-streaming-cursor: var(--ask-streaming-cursor-light, #737373);
    }
  `;

  @property({ type: String }) content = "";
  @property({ type: Boolean, reflect: true }) active = false;

  render() {
    if (!this.active) {
      return html``;
    }

    return html`
      <div class="streaming-content">
        ${this.content}<span class="streaming-cursor">▊</span>
      </div>
    `;
  }
}

customElements.define("ask-streaming", AskStreaming);

declare global {
  interface HTMLElementTagNameMap {
    "ask-streaming": AskStreaming;
  }
}
