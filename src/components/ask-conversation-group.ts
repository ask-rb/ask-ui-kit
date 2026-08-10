import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { property } from "lit/decorators.js";

/**
 * AskConversationGroup — a collapsible group header for conversation
 * sidebars, the folder pattern from the popular coding agents.
 *
 *   <ask-conversation-group label="project-a" count="12"></ask-conversation-group>
 *
 * The `label` renders in a folder style when `folder` is set. Slotted
 * content renders below the header when expanded.
 *
 * Events:
 *   group-toggle  { expanded }
 */
export class AskConversationGroup extends LitElement {
  static styles = css`${tokens}

    :host {
      display: block;
    }

    .header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.375rem 0.5rem;
      border: none;
      border-radius: 0.5rem;
      background: transparent;
      color: var(--ask-text-muted, #a3a3a3);
      font: inherit;
      cursor: pointer;
      text-align: left;
    }
    .header:hover {
      background: var(--ask-surface-hover, #f5f5f5);
      color: var(--ask-text, #171717);
    }

    .chevron {
      flex-shrink: 0;
      transition: transform 0.15s;
    }
    .chevron--open {
      transform: rotate(90deg);
    }

    .label {
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .count {
      margin-left: auto;
      font-size: 0.6875rem;
      color: var(--ask-text-muted, #a3a3a3);
      flex-shrink: 0;
    }
  `;

  @property({ type: String }) label = "";
  @property({ type: Number }) count = 0;
  @property({ type: Boolean }) expanded = true;

  render() {
    return html`
      <button class="header" @click=${this._toggle} aria-expanded=${this.expanded ? "true" : "false"}>
        <svg class="chevron ${this.expanded ? "chevron--open" : ""}" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <polyline points="9 6 15 12 9 18" />
        </svg>
        <span class="label">${this.label}</span>
        ${this.count > 0 ? html`<span class="count">${this.count}</span>` : ""}
      </button>
      ${this.expanded ? html`<slot></slot>` : ""}
    `;
  }

  private _toggle() {
    this.expanded = !this.expanded;
    this.dispatchEvent(new CustomEvent("group-toggle", { detail: { expanded: this.expanded }, bubbles: true, composed: true }));
  }
}

customElements.define("ask-conversation-group", AskConversationGroup);
