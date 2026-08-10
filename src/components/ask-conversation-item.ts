import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { property } from "lit/decorators.js";

/**
 * AskConversationItem — a conversation row for sidebars: title, meta, and
 * hover actions (rename/archive/delete). The pattern used by the popular
 * coding agents' session sidebars.
 *
 *   <ask-conversation-item title="Fix the login bug" meta="3 msgs"
 *     active></ask-conversation-item>
 *
 * Events:
 *   conversation-select    { id } — row clicked
 *   conversation-rename    { id }
 *   conversation-archive   { id }
 *   conversation-delete    { id }
 */
export class AskConversationItem extends LitElement {
  static styles = css`${tokens}

    :host {
      display: block;
    }

    .item {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      padding: 0.625rem 0.75rem;
      border-radius: 0.625rem;
      cursor: pointer;
      border: 1px solid transparent;
    }
    .item:hover {
      background: var(--ask-surface-hover, #f5f5f5);
    }
    .item--active {
      background: var(--ask-surface-active, #e5e5e5);
      border-color: var(--ask-border, #e5e5e5);
    }

    .title {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--ask-text, #171717);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .meta {
      font-size: 0.6875rem;
      color: var(--ask-text-muted, #a3a3a3);
    }

    .actions {
      display: none;
      position: absolute;
      right: 0.375rem;
      top: 50%;
      transform: translateY(-50%);
      gap: 0.125rem;
      background: inherit;
      border-radius: 0.5rem;
      padding: 0.125rem;
    }
    .item:hover .actions,
    .item--active .actions {
      display: inline-flex;
    }

    .mini {
      width: 1.5rem;
      height: 1.5rem;
      border: none;
      border-radius: 0.375rem;
      background: transparent;
      color: var(--ask-text-muted, #a3a3a3);
      font-size: 0.75rem;
      cursor: pointer;
    }
    .mini:hover {
      background: var(--ask-surface-active, #e5e5e5);
    }
    .mini--danger:hover {
      color: var(--ask-danger, #dc2626);
    }
  `;

  @property({ type: String }) id = "";
  @property({ type: String }) title = "";
  @property({ type: String }) meta = "";
  @property({ type: Boolean }) active = false;
  @property({ type: Boolean }) archived = false;

  render() {
    return html`
      <div class="item ${this.active ? "item--active" : ""}" @click=${this._select}>
        <span class="title">${this.title}</span>
        ${this.meta ? html`<span class="meta">${this.meta}</span>` : ""}
        <div class="actions">
          <button class="mini" title="Rename" @click=${this._emit("conversation-rename")}>✎</button>
          <button class="mini" title=${this.archived ? "Unarchive" : "Archive"} @click=${this._emit("conversation-archive")}>
            ${this.archived ? "↩" : "🗄"}
          </button>
          <button class="mini mini--danger" title="Delete" @click=${this._emit("conversation-delete")}>✕</button>
        </div>
      </div>
    `;
  }

  private _select(e: Event) {
    e.stopPropagation();
    this.dispatchEvent(new CustomEvent("conversation-select", { detail: { id: this.id }, bubbles: true, composed: true }));
  }

  private _emit(type: string) {
    return (e: Event) => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent(type, { detail: { id: this.id }, bubbles: true, composed: true }));
    };
  }
}

customElements.define("ask-conversation-item", AskConversationItem);
