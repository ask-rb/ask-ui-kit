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
      width: 2px;
      height: 1.1em;
      margin-left: 2px;
      vertical-align: -0.15em;
      border-radius: 1px;
      background: var(--ask-streaming-cursor, #737373);
      animation: ask-blink 1s step-end infinite;
    }

    @keyframes ask-blink {
      50% { opacity: 0; }
    }

    /* Theme via explicit [theme] attribute (apps control this directly —
       outer stylesheet rules for host custom properties always win over
       :host rules, so the attribute is the reliable signal) */
    :host([theme="dark"]) {
      --ask-streaming-text: var(--ask-streaming-text-dark, #f5f5f5);
      --ask-streaming-cursor: var(--ask-streaming-cursor-dark, #a3a3a3);
    }
    :host([theme="light"]) {
      --ask-streaming-text: var(--ask-streaming-text-light, #171717);
      --ask-streaming-cursor: var(--ask-streaming-cursor-light, #737373);
    }
    /* Fallbacks for apps that don't set [theme] */
    :host-context(.dark) {
      --ask-streaming-text: var(--ask-streaming-text-dark, #f5f5f5);
      --ask-streaming-cursor: var(--ask-streaming-cursor-dark, #a3a3a3);
    }
    :host-context(.light) {
      --ask-streaming-text: var(--ask-streaming-text-light, #171717);
      --ask-streaming-cursor: var(--ask-streaming-cursor-light, #737373);
    }
    @media (prefers-color-scheme: dark) {
      :host(:not([theme])) {
        --ask-streaming-text: var(--ask-streaming-text-dark, #f5f5f5);
        --ask-streaming-cursor: var(--ask-streaming-cursor-dark, #a3a3a3);
      }
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
        ${this.content}<span class="streaming-cursor" aria-hidden="true"></span>
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
