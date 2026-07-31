import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";

export class AskMessage extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    /* Layout */
    .message-row {
      display: flex;
      width: 100%;
    }
    .message-row--right {
      justify-content: flex-end;
    }

    /* Bubble: user messages get a background bubble, assistant is flat */
    .message-bubble {
      padding-block: 0.375rem;
      font-size: 0.875rem;
      line-height: 1.75;
      white-space: pre-wrap;
      overflow-wrap: break-word;
      overflow: hidden;
    }
    .message-bubble--user {
      max-width: fit-content;
      padding-inline: 0.75rem;
      border-radius: 0.75rem;
      border-top-right-radius: 0.125rem;
    }
    .message-bubble--assistant {
      max-width: 100%;
      padding-inline: 0.5rem;
    }

    /* Theming via CSS custom properties */
    @media (prefers-color-scheme: dark) {
      :host {
        --ask-user-bg: var(--ask-user-bg-dark, #262626);
        --ask-user-text: var(--ask-user-text-dark, #f5f5f5);
        --ask-assistant-text: var(--ask-assistant-text-dark, #f5f5f5);
      }
    }
    :host-context(.dark) {
      --ask-user-bg: var(--ask-user-bg-dark, #262626);
      --ask-user-text: var(--ask-user-text-dark, #f5f5f5);
      --ask-assistant-text: var(--ask-assistant-text-dark, #f5f5f5);
    }
    :host-context(.light) {
      --ask-user-bg: var(--ask-user-bg-light, #f5f5f5);
      --ask-user-text: var(--ask-user-text-light, #171717);
      --ask-assistant-text: var(--ask-assistant-text-light, #171717);
    }
  `;

  @property({ type: String }) role: "user" | "assistant" = "user";
  @property({ type: String }) content = "";

  render() {
    const isAssistant = this.role === "assistant";

    return html`
      <div class="message-row ${isAssistant ? "" : "message-row--right"}">
        <div
          class="message-bubble ${isAssistant ? "message-bubble--assistant" : "message-bubble--user"}"
          style="${isAssistant
            ? "color: var(--ask-assistant-text, #171717)"
            : `background: var(--ask-user-bg, #f5f5f5); color: var(--ask-user-text, #171717)`}"
        >${this.content}</div>
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
