import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { property, query } from "lit/decorators.js";

/**
 * AskDialog — a modal dialog (overlay + panel) for forms, confirmations,
 * and pickers.
 *
 *   <ask-dialog open header="Open workspace">
 *     <form slot="body">…</form>
 *   </ask-dialog>
 *
 * The panel closes on backdrop click and Escape; the body slot carries the
 * content, and optional `footer` slot content is right-aligned. Emits
 * `dialog-close` when dismissed.
 *
 * Events:
 *   dialog-close  {} — fired when the dialog is dismissed (backdrop/Escape)
 */
export class AskDialog extends LitElement {
  static styles = css`${tokens}

    :host {
      display: none;
    }
    :host([open]) {
      display: block;
    }

    .overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.6);
      z-index: 50;
      display: flex;
      justify-content: center;
      align-items: flex-start;
      padding: 15vh 1rem 1rem;
    }

    .panel {
      width: var(--ask-dialog-width, min(28rem, 100%));
      max-height: 80vh;
      overflow-y: auto;
      background: var(--ask-surface, #ffffff);
      border: 1px solid var(--ask-border-strong, #d4d4d4);
      border-radius: 1rem;
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.5);
      color: var(--ask-text, #171717);
    }

    .head {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 1.25rem 0.5rem;
    }
    .head h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .close {
      width: 2rem;
      height: 2rem;
      border: none;
      border-radius: 0.5rem;
      background: transparent;
      color: var(--ask-text-muted, #a3a3a3);
      font-size: 0.875rem;
      cursor: pointer;
      flex-shrink: 0;
    }
    .close:hover {
      background: var(--ask-surface-hover, #f5f5f5);
    }

    .body {
      padding: 0.25rem 1.25rem 1rem;
      font-size: 0.875rem;
      line-height: 1.6;
    }

    .footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
      padding: 0 1.25rem 1.25rem;
    }
  `;

  @property({ type: Boolean, reflect: true }) open = false;
  @property({ type: String }) header = "";

  @query(".panel") private _panel?: HTMLElement;

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("keydown", this._onKeydown);
  }

  disconnectedCallback() {
    this.removeEventListener("keydown", this._onKeydown);
    super.disconnectedCallback();
  }

  render() {
    return html`
      <div class="overlay" @click=${this._onBackdrop}>
        <div class="panel" role="dialog" aria-modal="true" aria-label=${this.header}>
          <div class="head">
            <h3>${this.header}</h3>
            <button class="close" @click=${this._close} aria-label="Close">✕</button>
          </div>
          <div class="body"><slot></slot></div>
          <div class="footer"><slot name="footer"></slot></div>
        </div>
      </div>
    `;
  }

  private _onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && this.open) {
      this._close();
    }
  }

  private _onBackdrop(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      this._close();
    }
  }

  private _close() {
    this.open = false;
    this.dispatchEvent(new CustomEvent("dialog-close", { bubbles: true, composed: true }));
  }
}

customElements.define("ask-dialog", AskDialog);
