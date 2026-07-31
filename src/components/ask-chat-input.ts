import { LitElement, html, css } from "lit";
import { property, query } from "lit/decorators.js";

export class AskChatInput extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .input-card {
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: var(--ask-input-bg, #fff);
      border: 1px solid var(--ask-input-border, #e5e5e5);
      border-radius: 1.125rem;
      transition: border-color 0.15s;
    }
    .input-card:focus-within {
      border-color: var(--ask-input-focus-border, #a3a3a3);
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
      color: var(--ask-input-text, #171717);
      min-height: 1.5rem;
      max-height: 12rem;
      padding: 0;
    }
    .input-textarea::placeholder {
      color: var(--ask-input-placeholder, #a3a3a3);
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
      border-radius: 9999px;
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
      background: var(--ask-input-send-bg, #171717);
      color: var(--ask-input-send-text, #fff);
    }
    .btn-send:hover:not(:disabled) {
      background: var(--ask-input-send-hover-bg, #404040);
    }

    .btn-stop {
      background: var(--ask-input-stop-bg, #f5f5f5);
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

    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      :host {
        --ask-input-bg: var(--ask-input-bg-dark, #1a1a1a);
        --ask-input-border: var(--ask-input-border-dark, #262626);
        --ask-input-focus-border: var(--ask-input-focus-border-dark, #525252);
        --ask-input-text: var(--ask-input-text-dark, #f5f5f5);
        --ask-input-placeholder: var(--ask-input-placeholder-dark, #525252);
        --ask-input-send-bg: var(--ask-input-send-bg-dark, #f5f5f5);
        --ask-input-send-text: var(--ask-input-send-text-dark, #171717);
        --ask-input-send-hover-bg: var(--ask-input-send-hover-bg-dark, #e5e5e5);
        --ask-input-stop-bg: var(--ask-input-stop-bg-dark, #262626);
        --ask-input-stop-text: var(--ask-input-stop-text-dark, #ef4444);
        --ask-input-stop-hover-bg: var(--ask-input-stop-hover-bg-dark, #450a0a);
      }
    }
    :host-context(.dark) {
      --ask-input-bg: var(--ask-input-bg-dark, #1a1a1a);
      --ask-input-border: var(--ask-input-border-dark, #262626);
      --ask-input-focus-border: var(--ask-input-focus-border-dark, #525252);
      --ask-input-text: var(--ask-input-text-dark, #f5f5f5);
      --ask-input-placeholder: var(--ask-input-placeholder-dark, #525252);
      --ask-input-send-bg: var(--ask-input-send-bg-dark, #f5f5f5);
      --ask-input-send-text: var(--ask-input-send-text-dark, #171717);
      --ask-input-send-hover-bg: var(--ask-input-send-hover-bg-dark, #e5e5e5);
      --ask-input-stop-bg: var(--ask-input-stop-bg-dark, #262626);
      --ask-input-stop-text: var(--ask-input-stop-text-dark, #ef4444);
      --ask-input-stop-hover-bg: var(--ask-input-stop-hover-bg-dark, #450a0a);
    }
    :host-context(.light) {
      --ask-input-bg: var(--ask-input-bg-light, #fff);
      --ask-input-border: var(--ask-input-border-light, #e5e5e5);
      --ask-input-focus-border: var(--ask-input-focus-border-light, #a3a3a3);
      --ask-input-text: var(--ask-input-text-light, #171717);
      --ask-input-placeholder: var(--ask-input-placeholder-light, #a3a3a3);
      --ask-input-send-bg: var(--ask-input-send-bg-light, #171717);
      --ask-input-send-text: var(--ask-input-send-text-light, #fff);
      --ask-input-send-hover-bg: var(--ask-input-send-hover-bg-light, #404040);
      --ask-input-stop-bg: var(--ask-input-stop-bg-light, #f5f5f5);
      --ask-input-stop-text: var(--ask-input-stop-text-light, #ef4444);
      --ask-input-stop-hover-bg: var(--ask-input-stop-hover-bg-light, #fee2e2);
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
    return html`
      <div class="input-card">
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
    `;
  }
}

customElements.define("ask-chat-input", AskChatInput);

declare global {
  interface HTMLElementTagNameMap {
    "ask-chat-input": AskChatInput;
  }
}
