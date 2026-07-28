import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";

const styles = css`
  :host {
    display: block;
  }

  .message-row {
    display: flex;
    width: 100%;
  }

  .message-row.user {
    justify-content: end;
  }

  .bubble {
    max-width: 75%;
    padding: 0.375rem 1rem;
    font-size: 0.875rem;
    line-height: 1.625;
    word-break: break-word;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
  }

  .bubble.user {
    background: var(--ask-user-bg, #f5f5f5);
    color: var(--ask-user-text, #1a1a1a);
    border-radius: var(--ask-user-radius, 1rem 1rem 0.25rem 1rem);
  }

  .bubble.assistant {
    background: transparent;
    color: var(--ask-assistant-text, #1a1a1a);
    max-width: 100%;
    padding-left: 0;
  }
`;

export class AskMessage extends LitElement {
  static styles = styles;

  @property({ type: String }) role: "user" | "assistant" = "user";
  @property({ type: String }) content = "";

  render() {
    return html`
      <div class="message-row ${this.role}">
        <div class="bubble ${this.role}">
          ${this.content}
        </div>
      </div>
    `;
  }
}

customElements.define("ask-message", AskMessage);

declare global {
  interface HTMLElementTagNameMap {
    "ask-message": AskMessage;
  }
}
