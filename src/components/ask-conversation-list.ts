import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { property, state } from "lit/decorators.js";

export interface ConversationItem {
  id: string;
  title: string;
  messageCount?: number;
  timestamp?: string; // ISO date string
  status?: "open" | "closed";
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export class AskConversationList extends LitElement {
  static styles = css`${tokens}

    :host {
      display: block;
    }

    .search-input {
      width: 100%;
      padding: var(--ask-radius, 0.5rem) 0.75rem;
      margin-bottom: var(--ask-radius, 0.5rem);
      border-radius: var(--ask-radius, 0.5rem);
      border: 1px solid var(--ask-border, #e5e5e5);
      background: var(--ask-surface, #fff);
      color: var(--ask-text, #171717);
      font-size: 0.8125rem;
      outline: none;
      box-sizing: border-box;
    }
    .search-input::placeholder {
      color: var(--ask-text-muted, #a3a3a3);
    }
    .search-input:focus {
      border-color: var(--ask-text-muted, #a3a3a3);
    }

    .section-header {
      padding: var(--ask-radius, 0.5rem) 0.625rem 0.25rem;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--ask-text-muted, #a3a3a3);
    }

    .conversation-item {
      display: flex;
      align-items: center;
      gap: var(--ask-radius, 0.5rem);
      padding: var(--ask-radius, 0.5rem) 0.625rem;
      border-radius: var(--ask-radius-small, 0.375rem);
      cursor: pointer;
      text-decoration: none;
      color: var(--ask-text, #171717);
      margin-bottom: 1px;
      transition: background 0.1s;
      border: 1px solid transparent;
    }
    .conversation-item:hover {
      background: var(--ask-surface-hover, #f5f5f5);
    }
    .conversation-item--active {
      background: var(--ask-border, #e5e5e5);
      border-color: var(--ask-border-strong, #d4d4d4);
    }

    .item-content {
      flex: 1;
      min-width: 0;
    }
    .item-title {
      font-size: 0.8125rem;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .item-meta {
      font-size: 0.6875rem;
      color: var(--ask-text-muted, #a3a3a3);
      margin-top: 0.125rem;
      display: flex;
      gap: 0.25rem;
    }

    .empty-state {
      padding: 2rem 1rem;
      text-align: center;
      color: var(--ask-text-muted, #a3a3a3);
      font-size: 0.8125rem;
    }

    
    
  `;

  @property({ type: String }) items = "";
  @property({ type: String }) activeId = "";

  @state() private _search = "";

  private _parsedItems(): ConversationItem[] {
    try {
      const parsed = JSON.parse(this.items);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // ignore
    }
    return [];
  }

  private _handleSearch(e: Event) {
    this._search = (e.target as HTMLInputElement).value;
  }

// Keyboard support for the clickable items (Enter/Space activate).
private _handleItemKeydown(e: KeyboardEvent, id: string) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    this._handleSelect(id);
  }
}

  private _handleSelect(id: string) {
    this.dispatchEvent(
      new CustomEvent("ask-select", {
        detail: { id },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const allItems = this._parsedItems();
    const query = this._search.toLowerCase();

    const filtered = allItems.filter((item) => {
      if (!query) return true;
      return (
        item.title.toLowerCase().includes(query) ||
        `${item.messageCount || 0} messages`.includes(query)
      );
    });

    const hasOpen = filtered.some((i) => i.status !== "closed");
    const hasClosed = filtered.some((i) => i.status === "closed");

    if (allItems.length === 0) {
      return html`
        <div class="empty-state">
          <p>No conversations yet</p>
        </div>
      `;
    }

    return html`
      <input
        class="search-input"
        type="search"
        placeholder="Search conversations..."
        @input=${this._handleSearch}
        .value=${this._search}
      />

      ${hasOpen
        ? html`
            <div class="section-header">Open</div>
            ${filtered
              .filter((i) => i.status !== "closed")
              .map(
                (item) => html`
                  <div
                    class="conversation-item ${item.id === this.activeId ? "conversation-item--active" : ""}"
        role="button"
        tabindex="0"
        @click=${() => this._handleSelect(item.id)}
        @keydown=${(e: KeyboardEvent) => this._handleItemKeydown(e, item.id)}
                  >
                    <div class="item-content">
                      <div class="item-title">${item.title || "Untitled"}</div>
                      <div class="item-meta">
                        <span>${item.messageCount || 0} messages</span>
                        ${item.timestamp ? html`<span>·</span><span>${timeAgo(item.timestamp)}</span>` : ""}
                      </div>
                    </div>
                  </div>
                `
              )}
          `
        : ""
      }

      ${hasClosed
        ? html`
            <div class="section-header">Closed</div>
            ${filtered
              .filter((i) => i.status === "closed")
              .map(
                (item) => html`
                  <div
                    class="conversation-item ${item.id === this.activeId ? "conversation-item--active" : ""}"
        role="button"
        tabindex="0"
        @click=${() => this._handleSelect(item.id)}
        @keydown=${(e: KeyboardEvent) => this._handleItemKeydown(e, item.id)}
                  >
                    <div class="item-content">
                      <div class="item-title">${item.title || "Untitled"}</div>
                      <div class="item-meta">
                        <span>${item.messageCount || 0} messages</span>
                        ${item.timestamp ? html`<span>·</span><span>${timeAgo(item.timestamp)}</span>` : ""}
                      </div>
                    </div>
                  </div>
                `
              )}
          `
        : ""
      }
    `;
  }
}

customElements.define("ask-conversation-list", AskConversationList);

declare global {
  interface HTMLElementTagNameMap {
    "ask-conversation-list": AskConversationList;
  }
}
