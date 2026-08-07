import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { property } from "lit/decorators.js";

export class AskAttachment extends LitElement {
  static styles = css`${tokens}

    :host {
      display: block;
    }

    .attachment-card {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      padding: var(--ask-radius, 0.5rem) 0.75rem;
      background: var(--ask-text-inverse, #fafafa);
      border: 1px solid var(--ask-border, #e5e5e5);
      border-radius: 0.75rem;
      position: relative;
    }

    .attachment-preview {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--ask-radius, 0.5rem);
      overflow: hidden;
      flex-shrink: 0;
      background: var(--ask-border, #e5e5e5);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.25rem;
      color: var(--ask-text-muted, #a3a3a3);
    }
    .attachment-preview-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .attachment-info {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }
    .attachment-name {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--ask-border-strong, #404040);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 11rem;
    }
    .attachment-size {
      font-size: 0.6875rem;
      color: var(--ask-text-muted, #a3a3a3);
    }

    .attachment-remove {
      position: absolute;
      top: -var(--ask-radius-small, 0.375rem);
      right: -var(--ask-radius-small, 0.375rem);
      width: 1.25rem;
      height: 1.25rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--ask-radius-pill, 9999px);
      border: none;
      background: var(--ask-border, #262626);
      color: var(--ask-surface, #fff);
      font-size: 0.625rem;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.1s;
    }
    .attachment-card:hover .attachment-remove {
      opacity: 1;
    }
    .attachment-remove:hover {
      background: var(--ask-border-strong, #404040);
    }

    
    
  `;

  @property({ type: String }) name = "";
  @property({ type: Number }) size = 0;
  @property({ type: String }) type = "";
  @property({ type: String }) src = "";
  @property({ type: Boolean }) removable = false;

  private _formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / 1048576).toFixed(1)}MB`;
  }

  private _handleRemove() {
    this.dispatchEvent(
      new CustomEvent("ask-remove", {
        detail: { name: this.name },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const isImage = this.type.startsWith("image/");
    const isPdf = this.type.includes("pdf");
    const icon = isPdf ? "📕" : "📄";

    return html`
      <div class="attachment-card">
        <div class="attachment-preview">
          ${isImage
            ? html`<img class="attachment-preview-img" src=${this.src || ""} alt=${this.name} />`
            : html`<span>${icon}</span>`
          }
        </div>
        <div class="attachment-info">
          <span class="attachment-name" title=${this.name}>${this.name}</span>
          <span class="attachment-size">${this._formatSize(this.size)}</span>
        </div>
        ${this.removable
          ? html`
              <button class="attachment-remove" @click=${this._handleRemove} aria-label="Remove ${this.name}">
                ×
              </button>
            `
          : ""
        }
      </div>
    `;
  }
}

customElements.define("ask-attachment", AskAttachment);

declare global {
  interface HTMLElementTagNameMap {
    "ask-attachment": AskAttachment;
  }
}
