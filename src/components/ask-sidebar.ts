import { LitElement, html, css, TemplateResult } from "lit";
import { tokens } from "../styles/tokens.js";
import { property, state } from "lit/decorators.js";

export interface SidebarNode {
  id: string;
  label: string;
  /** Secondary line under the label, e.g. "rubyonrails.org · 5m ago". */
  sub?: string;
  /** "site" nodes nest conversations as children; "chat" nodes select. */
  kind?: "site" | "chat";
  children?: SidebarNode[];
}

export interface SidebarGroup {
  id: string;
  label: string;
  collapsed?: boolean;
  nodes: SidebarNode[];
}

/**
 * Hierarchical conversation sidebar: collapsible groups (e.g. "Sites",
 * "Chats"), site nodes that nest their conversations, a New-chat button.
 * Dumb and framework-agnostic: data in as a JSON attribute, interactions
 * out as `ask-select` / `ask-new-chat` events.
 */
export class AskSidebar extends LitElement {
  static styles = css`${tokens}

    :host {
      display: block;
      font-family: var(--ask-sidebar-font, inherit);
      color: var(--ask-text, #171717);
    }

    .new-chat {
      display: flex;
      align-items: center;
      gap: var(--ask-radius, 0.5rem);
      width: 100%;
      padding: var(--ask-radius, 0.5rem) 0.625rem;
      margin-bottom: var(--ask-radius, 0.5rem);
      border-radius: var(--ask-radius, 0.5rem);
      border: 1px solid var(--ask-border, #e5e5e5);
      background: var(--ask-text, #171717);
      color: var(--ask-text-inverse, #fafafa);
      font-size: 0.8125rem;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.1s;
    }
    .new-chat:hover {
      opacity: 0.9;
    }

    .group {
      margin-bottom: 0.25rem;
    }
    .group-header {
      display: flex;
      align-items: center;
      gap: var(--ask-radius-small, 0.375rem);
      width: 100%;
      padding: var(--ask-radius-small, 0.375rem) 0.625rem;
      border: 0;
      background: transparent;
      color: var(--ask-text-muted, #a3a3a3);
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      text-align: left;
      cursor: pointer;
      border-radius: var(--ask-radius-small, 0.375rem);
    }
    .group-header:hover {
      background: var(--ask-surface-hover, #f5f5f5);
      color: var(--ask-text, #171717);
    }
    .chevron {
      display: inline-block;
      font-size: 0.625rem;
      transition: transform 0.12s;
      color: var(--ask-text-muted, #a3a3a3);
    }
    .chevron--open {
      transform: rotate(90deg);
    }

    .group-nodes {
      margin-top: 1px;
    }

    .node {
      display: flex;
      align-items: center;
      gap: var(--ask-radius, 0.5rem);
      width: 100%;
      padding: var(--ask-radius, 0.5rem) 0.625rem;
      border: 1px solid transparent;
      border-radius: var(--ask-radius-small, 0.375rem);
      background: transparent;
      color: var(--ask-text, #171717);
      font-size: 0.8125rem;
      text-align: left;
      cursor: pointer;
      margin-bottom: 1px;
      transition: background 0.1s;
      box-sizing: border-box;
    }
    .node:hover {
      background: var(--ask-surface-hover, #f5f5f5);
    }
    .node--active {
      background: var(--ask-surface-active, #e5e5e5);
      border-color: var(--ask-border-strong, #d4d4d4);
    }
    .node--indent-1 {
      padding-left: 1.5rem;
    }
    .node--indent-2 {
      padding-left: 2.25rem;
    }

    .node-content {
      flex: 1;
      min-width: 0;
    }
    .node-label {
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .node-sub {
      font-size: 0.6875rem;
      color: var(--ask-text-muted, #a3a3a3);
      margin-top: 0.125rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .node-dot {
      width: 6px;
      height: 6px;
      border-radius: var(--ask-radius-pill, 9999px);
      flex-shrink: 0;
      background: var(--ask-text-muted, #a3a3a3);
    }
    .node-dot--accent {
      background: var(--ask-accent, #c2410c);
    }

    .empty {
      padding: 1rem 0.625rem;
      font-size: 0.75rem;
      color: var(--ask-text-muted, #a3a3a3);
    }

    
    
  `;

  @property({ type: String }) groups = "";
  @property({ type: String, attribute: "active-id" }) activeId = "";
  @property({ type: String, attribute: "new-chat-label" }) newChatLabel = "New chat";
  /** sessionStorage key for collapse/expand state (persists across navigations). */
  @property({ type: String, attribute: "storage-key" }) storageKey = "ask-sidebar";


  @state() private _collapsed: Record<string, boolean> = {};
  @state() private _expanded: Record<string, boolean> = {};

connectedCallback() {
  super.connectedCallback();
  this._loadState();
}

private _loadState() {
  try {
    const raw = sessionStorage.getItem(this.storageKey);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    this._collapsed = parsed.collapsed || {};
    this._expanded = parsed.expanded || {};
  } catch {
    // ignore corrupt state
  }
}

private _saveState() {
  try {
    sessionStorage.setItem(
      this.storageKey,
      JSON.stringify({ collapsed: this._collapsed, expanded: this._expanded })
    );
  } catch {
    // ignore (private mode etc.)
  }
}
  private _parsedGroups(): SidebarGroup[] {
    try {
      const parsed = JSON.parse(this.groups);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // ignore malformed data
    }
    return [];
  }

  private _emit(name: string, detail: Record<string, unknown>) {
    this.dispatchEvent(new CustomEvent(name, { detail, bubbles: true, composed: true }));
  }

  private _group(id: string): SidebarGroup | undefined {
    return this._parsedGroups().find((g) => g.id === id);
  }

  private _findNode(id: string): SidebarNode | undefined {
    for (const group of this._parsedGroups()) {
      const found = this._searchNode(group.nodes, id);
      if (found) return found;
    }
    return undefined;
  }

  private _searchNode(nodes: SidebarNode[], id: string): SidebarNode | undefined {
    for (const node of nodes) {
      if (node.id === id) return node;
      const found = this._searchNode(node.children ?? [], id);
      if (found) return found;
    }
    return undefined;
  }

  private _toggleGroup(id: string) {
    this._collapsed = { ...this._collapsed, [id]: !this._isCollapsed(id) };
    this._saveState();
  }

  private _toggleNode(id: string) {
    const node = this._findNode(id);
    const next = node ? !this._isExpanded(node) : !(this._expanded[id] ?? false);
    this._expanded = { ...this._expanded, [id]: next };
    this._saveState();
  }

  private _isCollapsed(id: string): boolean {
    return this._collapsed[id] ?? this._group(id)?.collapsed ?? false;
  }

  private _isExpanded(node: SidebarNode): boolean {
    return this._expanded[node.id] ?? this._containsActive(node);
  }

  private _containsActive(node: SidebarNode): boolean {
    if (node.id === this.activeId) return true;
    return (node.children ?? []).some((child) => child.id === this.activeId);
  }

  private _node(node: SidebarNode, depth: number): TemplateResult {
    const hasChildren = (node.children ?? []).length > 0;

    if (hasChildren) {
      const open = this._isExpanded(node);
      return html`
        <div>
          <button
            class="node node--indent-${depth} ${this._containsActive(node) ? "node--active" : ""}"
            @click=${() => this._toggleNode(node.id)}
          >
            <span class="chevron ${open ? "chevron--open" : ""}">▸</span>
            <span class="node-dot ${node.kind === "site" ? "node-dot--accent" : ""}"></span>
            <span class="node-content">
              <span class="node-label">${node.label}</span>
              ${node.sub ? html`<span class="node-sub">${node.sub}</span>` : ""}
            </span>
          </button>
          ${open
            ? html`${(node.children ?? []).map((child) => this._node(child, depth + 1))}`
            : ""}
        </div>
      `;
    }

    return html`
      <button
        class="node node--indent-${depth} ${node.id === this.activeId ? "node--active" : ""}"
        @click=${() => this._emit("ask-select", { id: node.id })}
      >
        <span class="node-dot ${node.kind === "site" ? "node-dot--accent" : ""}"></span>
        <span class="node-content">
          <span class="node-label">${node.label}</span>
          ${node.sub ? html`<span class="node-sub">${node.sub}</span>` : ""}
        </span>
      </button>
    `;
  }

  render() {
    const groups = this._parsedGroups();

    return html`
      <button class="new-chat" @click=${() => this._emit("ask-new-chat", {})}>
        ＋ ${this.newChatLabel}
      </button>

      ${groups.length === 0
        ? html`<div class="empty">No conversations yet</div>`
        : groups.map(
            (group) => html`
              <div class="group">
                <button class="group-header" @click=${() => this._toggleGroup(group.id)}>
                  <span class="chevron ${this._isCollapsed(group.id) ? "" : "chevron--open"}">▸</span>
                  ${group.label}
                </button>
                ${this._isCollapsed(group.id)
                  ? ""
                  : html`<div class="group-nodes">${group.nodes.map((n) => this._node(n, 0))}</div>`}
              </div>
            `
          )}
    `;
  }
}

customElements.define("ask-sidebar", AskSidebar);

declare global {
  interface HTMLElementTagNameMap {
    "ask-sidebar": AskSidebar;
  }
}
