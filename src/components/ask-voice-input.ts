import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { property, state } from "lit/decorators.js";

export class AskVoiceInput extends LitElement {
  static styles = css`${tokens}

    :host {
      display: inline-flex;
    }

    .voice-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--ask-radius-pill, 9999px);
      border: 1px solid var(--ask-border, #e5e5e5);
      background: var(--ask-surface, #fff);
      color: var(--ask-text-faint, #525252);
      cursor: pointer;
      font-size: 1.125rem;
      transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
      position: relative;
    }
    .voice-btn:hover:not(:disabled) {
      background: var(--ask-surface-hover, #f5f5f5);
    }
    .voice-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .voice-btn--recording {
      background: var(--ask-danger-bg, #fef2f2);
      border-color: var(--ask-danger-text, #fca5a5);
      color: var(--ask-voice-recording-text, #ef4444);
      animation: voice-pulse 1.5s ease-in-out infinite;
    }

    .voice-timer {
      font-size: 0.75rem;
      font-family: monospace;
      color: var(--ask-voice-timer, #ef4444);
      margin-left: var(--ask-radius, 0.5rem);
      align-self: center;
    }

    @keyframes voice-pulse {
      0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.3); }
      50% { box-shadow: 0 0 0 8px rgba(239, 68, 68, 0); }
    }

    
    
  `;

  @property({ type: Boolean, reflect: true }) recording = false;
  @property({ type: Boolean }) disabled = false;

  @state() private _elapsed = 0;
  private _timerId: ReturnType<typeof setInterval> | null = null;

  private _handleClick() {
    if (this.disabled) return;

    if (this.recording) {
      this._stopRecording();
    } else {
      this._startRecording();
    }
  }

  private _startRecording() {
    this.recording = true;
    this._elapsed = 0;
    this._timerId = setInterval(() => {
      this._elapsed++;
    }, 1000);

    this.dispatchEvent(
      new CustomEvent("ask-record-start", {
        bubbles: true,
        composed: true,
      })
    );
  }

  private _stopRecording() {
    this.recording = false;
    if (this._timerId) {
      clearInterval(this._timerId);
      this._timerId = null;
    }

    this.dispatchEvent(
      new CustomEvent("ask-record-stop", {
        detail: { elapsed: this._elapsed },
        bubbles: true,
        composed: true,
      })
    );
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._timerId) {
      clearInterval(this._timerId);
    }
  }

  private _formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  render() {
    return html`
      <button
        class="voice-btn ${this.recording ? "voice-btn--recording" : ""}"
        @click=${this._handleClick}
        ?disabled=${this.disabled}
        aria-label=${this.recording ? "Stop recording" : "Start recording"}
      >
        ${this.recording ? "⏹" : "🎤"}
      </button>
      ${this.recording ? html`<span class="voice-timer">${this._formatTime(this._elapsed)}</span>` : ""}
    `;
  }
}

customElements.define("ask-voice-input", AskVoiceInput);

declare global {
  interface HTMLElementTagNameMap {
    "ask-voice-input": AskVoiceInput;
  }
}
