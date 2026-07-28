import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import styles from "./ask-message.css?inline";

export class AskMessage extends LitElement {
  static styles = unsafeCSS(styles);

  @property({ type: String }) role: "user" | "assistant" = "user";
  @property({ type: String }) content = "";

  render() {
    const isAssistant = this.role === "assistant";

    return html`
      <div class="flex w-full ${isAssistant ? "" : "justify-end"}">
        <div
          class="${isAssistant
            ? "max-w-full"
            : "max-w-[75%] px-3 py-1 text-sm leading-[1.75] rounded-xl rounded-tr-sm"} whitespace-pre-wrap break-words overflow-wrap-anywhere"
          style="${isAssistant
            ? ""
            : `background: var(--ask-user-bg, #f5f5f5); color: var(--ask-user-text, #171717);`}"
        >
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
