import { LitElement, html, unsafeCSS } from "lit";
import { property } from "lit/decorators.js";
import styles from "./ask-message.css?inline";

export class AskMessage extends LitElement {
  static styles = unsafeCSS(styles);

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
