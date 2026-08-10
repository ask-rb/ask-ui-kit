import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { property, query } from "lit/decorators.js";

export interface MenuItemData {
  /** Unique id (used as the item key and for `menu-select` detail). */
  id: string;
  label: string;
  /** Optional secondary line under the label. */
  description?: string;
  /** Emoji/icon prefix. */
  icon?: string;
  /** True when the item represents the active selection. */
  active?: boolean;
  /** Renders a separator above this item. */
  separator?: boolean;
}

/**
 * AskMenu — a dropdown menu (trigger + popover list), the pattern used by
 * the popular coding agents for session/project switchers.
 *
 *   <ask-menu .items=${[{id, label, description, icon, active}]}
 *             trigger-label="Switch workspace"></ask-menu>
 *
 * Opens on trigger click, closes on outside click, Escape, or item select.
 * Item rows may include an optional footer action slot
 * (`<div slot="menu-footer">`) — used for "Open workspace…" style actions.
 *
 * Events:
 *   menu-open    {} — menu opened
 *   menu-close   {} — menu closed
 *   menu-select  { id } — an item was selected (menu closes)
 */
export class AskMenu extends LitElement {
  static styles = css`${tokens}

    :host {
      display: inline-block;
      position: relative;
    }

    .trigger {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      max-width: 100%;
      font: inherit;
      color: inherit;
      background: transparent;
      border: 1px solid transparent;
      border-radius: 0.625rem;
      padding: 0.375rem 0.625rem;
      cursor: pointer;
    }
    .trigger:hover {
      background: var(--ask-surface-hover, #f5f5f5);
      border-color: var(--ask-border, #e5e5e5);
    }
    .trigger .caret {
      flex-shrink: 0;
      color: var(--ask-text-muted, #a3a3a3);
    }

    .menu {
      position: absolute;
      top: calc(100% + 0.375rem);
      left: 0;
      min-width: var(--ask-menu-width, 18rem);
      max-width: min(24rem, calc(100vw - 2rem));
      max-height: 60vh;
      overflow-y: auto;
      background: var(--ask-surface, #ffffff);
      border: 1px solid var(--ask-border, #e5e5e5);
      border-radius: 0.75rem;
      box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
      padding: 0.375rem;
      z-index: 40;
      color: var(--ask-text, #171717);
    }
    :host([theme="dark"]) .menu { box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6); }

    .item {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      width: 100%;
      text-align: left;
      padding: 0.5rem 0.625rem;
      border: none;
      border-radius: 0.5rem;
      background: transparent;
      color: inherit;
      font: inherit;
      cursor: pointer;
    }
    .item:hover {
      background: var(--ask-surface-hover, #f5f5f5);
    }
    .item--active {
      background: var(--ask-surface-active, #e5e5e5);
    }

    .item .icon {
      flex-shrink: 0;
      width: 1rem;
      text-align: center;
    }
    .item .texts {
      min-width: 0;
      flex: 1;
    }
    .item .label {
      display: block;
      font-size: 0.8125rem;
      font-weight: 600;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .item .description {
      display: block;
      font-size: 0.6875rem;
      font-weight: 400;
      color: var(--ask-text-muted, #a3a3a3);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .item .check {
      margin-left: auto;
      flex-shrink: 0;
      color: var(--ask-accent, #c2410c);
    }

    .separator {
      height: 1px;
      background: var(--ask-border, #e5e5e5);
      margin: 0.25rem 0.375rem;
    }

    .empty {
      padding: 0.75rem 0.625rem;
      font-size: 0.75rem;
      color: var(--ask-text-muted, #a3a3a3);
      text-align: center;
    }

    .footer-slot {
      border-top: 1px solid var(--ask-border, #e5e5e5);
      margin-top: 0.25rem;
      padding-top: 0.25rem;
    }
  `;

  @property({ type: Array }) items: MenuItemData[] = [];
  @property({ type: String }) triggerLabel = "";
  @property({ type: Boolean }) open = false;

  @query(".menu") private _menu?: HTMLElement;

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("pointerdown", this._onOutside);
  }

  disconnectedCallback() {
    document.removeEventListener("pointerdown", this._onOutside);
    super.disconnectedCallback();
  }

  render() {
    return html`
      <button class="trigger" @click=${this._toggle} aria-expanded=${this.open ? "true" : "false"}>
        <slot name="trigger">${this.triggerLabel}</slot>
        <svg class="caret" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      ${this.open
        ? html`
            <div class="menu" role="menu">
              ${this.items.length === 0
                ? html`<div class="empty">Nothing here yet.</div>`
                : this.items.map(
                    (item) => html`
                      ${item.separator ? html`<div class="separator"></div>` : ""}
                      <button
                        class="item ${item.active ? "item--active" : ""}"
                        role="menuitem"
                        @click=${() => this._select(item)}
                      >
                        ${item.icon ? html`<span class="icon">${item.icon}</span>` : ""}
                        <span class="texts">
                          <span class="label">${item.label}</span>
                          ${item.description ? html`<span class="description">${item.description}</span>` : ""}
                        </span>
                        ${item.active ? html`<span class="check">✓</span>` : ""}
                      </button>
                    `
                  )}
              <slot name="menu-footer"></slot>
            </div>
          `
        : ""}
    `;
  }

  private _toggle() {
    this.open = !this.open;
    this.dispatchEvent(new CustomEvent(this.open ? "menu-open" : "menu-close", { bubbles: true, composed: true }));
  }

  private _select(item: MenuItemData) {
    this.open = false;
    this.dispatchEvent(new CustomEvent("menu-select", { detail: { id: item.id }, bubbles: true, composed: true }));
  }

  private _onOutside = (e: PointerEvent) => {
    if (!this.open) return;
    const path = e.composedPath();
    if (!path.includes(this)) {
      this.open = false;
      this.dispatchEvent(new CustomEvent("menu-close", { bubbles: true, composed: true }));
    }
  };
}

customElements.define("ask-menu", AskMenu);
