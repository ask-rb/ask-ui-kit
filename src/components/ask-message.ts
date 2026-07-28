import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";

const styles = css`
  :host {
    display: block;
    margin: 0;
    padding: 0;
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
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    line-height: 1.75;
    word-break: break-word;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
  }

  .bubble.user {
    background: var(--ask-user-bg, #f5f5f5);
    color: var(--ask-user-text, #171717);
    border-radius: var(--ask-user-radius, 0.75rem 0.125rem 0.75rem 0.75rem);
  }

  :host-context(.dark) .bubble.user {
    background: var(--ask-user-bg-dark, #262626);
    color: var(--ask-user-text-dark, #f5f5f5);
  }

  .bubble.assistant {
    background: transparent;
    color: var(--ask-assistant-text, #171717);
    max-width: 100%;
    padding-left: 0;
  }

  :host-context(.dark) .bubble.assistant {
    color: var(--ask-assistant-text-dark, #f5f5f5);
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
