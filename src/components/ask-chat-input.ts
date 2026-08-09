import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { property, query } from "lit/decorators.js";

export class AskChatInput extends LitElement {
  static styles = css`${tokens}

    :host {
      display: block;
    }

    .input-card {
      display: flex;
      flex-direction: column;
      gap: var(--ask-radius, 0.5rem);
      padding: var(--ask-radius, 0.5rem) 1rem;
      background: var(--ask-surface, #fff);
      border: 1px solid var(--ask-border, #e5e5e5);
      border-radius: 1.125rem;
      transition: border-color 0.15s;
    }
    .input-card:focus-within {
      border-color: var(--ask-text-muted, #a3a3a3);
    }

    .input-main {
      display: flex;
      align-items: flex-end;
      gap: var(--ask-radius, 0.5rem);
    }

    /* Context pill(s) above the input (the thing being chatted about). */
    .input-context {
      display: flex;
      align-items: center;
      gap: var(--ask-radius-small, 0.375rem);
      margin-bottom: 0.375rem;
    }

    /* Bottom toolbar row inside the input: host content (attachments,
     * approve chips, model selector) left, send button right. Rendered
     * only when the host provides toolbar content. */
    .input-toolbar {
      display: flex;
      align-items: center;
      gap: var(--ask-radius, 0.5rem);
    }
    .input-toolbar-spacer {
      flex: 1;
    }

    .input-textarea {
      flex: 1;
      border: none;
      background: transparent;
      resize: none;
      outline: none;
      font-family: inherit;
      font-size: 0.875rem;
      line-height: 1.5;
      color: var(--ask-text, #171717);
      min-height: 1.5rem;
      max-height: 12rem;
      padding: 0;
    }
    .input-textarea::placeholder {
      color: var(--ask-text-muted, #a3a3a3);
    }
    .input-textarea:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .input-actions {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      flex-shrink: 0;
    }

    .input-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border-radius: var(--ask-radius-pill, 9999px);
      border: none;
      cursor: pointer;
      font-size: 1rem;
      transition: background 0.15s, opacity 0.15s;
    }
    .input-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .btn-send {
      background: var(--ask-text, #171717);
      color: var(--ask-surface, #fff);
    }
    .btn-send:hover:not(:disabled) {
      background: var(--ask-border-strong, #404040);
    }

    .btn-stop {
      background: var(--ask-surface-muted, #f5f5f5);
      color: var(--ask-input-stop-text, #ef4444);
    }
    .btn-stop:hover {
      background: var(--ask-input-stop-hover-bg, #fee2e2);
    }

    .btn-icon {
      width: 1rem;
      height: 1rem;
    }

    .btn-hidden {
      display: none;
    }

    
    
  `;

  @property({ type: String }) value = "";
  @property({ type: String }) placeholder = "Type a message...";
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) streaming = false;

  @query(".input-textarea", true) private _textarea!: HTMLTextAreaElement;

  private _handleInput(e: InputEvent) {
    const target = e.target as HTMLTextAreaElement;
    this.value = target.value;
    this._autoResize();
    this.dispatchEvent(
      new CustomEvent("ask-input", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _autoResize() {
    const el = this._textarea;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 192) + "px"; // 12rem = 192px
  }

  private _handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this._submit();
    }
  }

  private _submit() {
    const val = this.value.trim();
    if (!val || this.disabled || this.streaming) return;

    this.dispatchEvent(
      new CustomEvent("ask-submit", {
        detail: { value: val },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleStop() {
    this.dispatchEvent(
      new CustomEvent("ask-stop", {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleKeydownGlobal(e: KeyboardEvent) {
    if (e.key === "Escape" && this.streaming) {
      this._handleStop();
    }
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("keydown", this._handleKeydownGlobal.bind(this));
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener("keydown", this._handleKeydownGlobal.bind(this));
  }

  render() {
    const hasContext = this.querySelector(":scope > [slot='context']") !== null;
    const hasToolbar = this.querySelector(":scope > [slot='toolbar']") !== null;
    return html`
      ${hasContext
        ? html`<div class="input-context" part="context"><slot name="context"></slot></div>`
        : ""}
      <div class="input-card">
        <div class="input-main">
          <textarea
            class="input-textarea"
            .value=${this.value}
            placeholder=${this.placeholder}
            ?disabled=${this.disabled}
            @input=${this._handleInput}
            @keydown=${this._handleKeydown}
            rows="1"
          ></textarea>
          <div class="input-actions">
            ${hasToolbar ? "" : this._sendButton()}
            <button
              class="input-btn btn-stop ${this.streaming ? "" : "btn-hidden"}"
              @click=${this._handleStop}
              aria-label="Stop streaming"
            >
              <svg class="btn-icon" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2"/>
              </svg>
            </button>
          </div>
        </div>
        ${hasToolbar
          ? html`
              <div class="input-toolbar" part="toolbar">
                <slot name="toolbar"></slot>
                <span class="input-toolbar-spacer"></span>
                ${this._sendButton()}
              </div>
            `
          : ""}
      </div>
    `;
  }

  private _sendButton() {
    return html`
      <button
        class="input-btn btn-send ${this.streaming ? "btn-hidden" : ""}"
        @click=${this._submit}
        ?disabled=${this.disabled || !this.value.trim()}
        aria-label="Send message"
      >
        <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </button>
    `;
  }
}

customElements.define("ask-chat-input", AskChatInput);

declare global {
  interface HTMLElementTagNameMap {
    "ask-chat-input": AskChatInput;
  }
}
