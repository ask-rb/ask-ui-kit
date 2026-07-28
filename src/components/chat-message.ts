import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";

export class ChatMessage extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .bubble {
      max-width: 90%;
      padding: 0.375rem 1rem;
      font-size: 0.875rem;
      line-height: 1.625;
      border-radius: 1.5rem;
      word-break: break-word;
      overflow-wrap: anywhere;
      white-space: pre-wrap;
    }

    .bubble.user {
      background: var(--ask-user-bg, #f5f5f5);
      color: var(--ask-user-text, #000);
      border-bottom-right-radius: 0.25rem;
    }

    .bubble.assistant {
      background: transparent;
      color: var(--ask-assistant-text, #000);
      max-width: 100%;
    }
  `;

  @property({ type: String }) role: "user" | "assistant" = "user";
  @property({ type: String }) content = "";

  render() {
    return html`
      <div class="bubble ${this.role}">
        ${this.content}
      </div>
    `;
  }
}

customElements.define("chat-message", ChatMessage);

declare global {
  interface HTMLElementTagNameMap {
    "chat-message": ChatMessage;
  }
}
