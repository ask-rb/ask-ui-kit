import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { property } from "lit/decorators.js";

export class AskAvatar extends LitElement {
  static styles = css`${tokens}

    :host {
      display: inline-flex;
    }

    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--ask-radius-small, 0.375rem);
      flex-shrink: 0;
      overflow: hidden;
      background: var(--ask-surface-active, #e5e5e5);
      color: var(--ask-text-faint, #737373);
      font-size: 0.875rem;
      line-height: 1;
      font-weight: 500;
    }

    .avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-fallback {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
    }

    
    
  `;

  @property({ type: String }) src = "";
  @property({ type: String }) name = "";
  @property({ type: String }) role: "user" | "assistant" = "assistant";
  @property({ type: Number }) size = 28;

  render() {
    const sizePx = `${this.size}px`;

    if (this.src) {
      return html`
        <div class="avatar" style="width: ${sizePx}; height: ${sizePx};">
          <img class="avatar-img" src=${this.src} alt=${this.name || "avatar"} />
        </div>
      `;
    }

    let fallback: string;
    if (this.name) {
      fallback = this.name.charAt(0).toUpperCase();
    } else {
      fallback = this.role === "assistant" ? "🤖" : "👤";
    }

    return html`
      <div class="avatar" style="width: ${sizePx}; height: ${sizePx};">
        <span class="avatar-fallback">${fallback}</span>
      </div>
    `;
  }
}

customElements.define("ask-avatar", AskAvatar);

declare global {
  interface HTMLElementTagNameMap {
    "ask-avatar": AskAvatar;
  }
}
