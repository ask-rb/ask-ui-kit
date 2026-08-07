import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { property } from "lit/decorators.js";

export class AskStreaming extends LitElement {
  static styles = css`${tokens}

    :host {
      display: block;
    }
    :host([hidden]) {
      display: none;
    }

    .streaming-content {
      font-size: 0.875rem;
      line-height: 1.75;
      color: var(--ask-text, #171717);
      white-space: pre-wrap;
    }

    .streaming-cursor {
      display: inline-block;
      width: 2px;
      height: 1.1em;
      margin-left: 2px;
      vertical-align: -0.15em;
      border-radius: 1px;
      background: var(--ask-text-faint, #737373);
      animation: ask-blink 1s step-end infinite;
    }

    @keyframes ask-blink {
      50% { opacity: 0; }
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
