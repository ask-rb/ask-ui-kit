import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { property } from "lit/decorators.js";

export type ToolStatus = "running" | "done" | "failed";

export class AskToolCall extends LitElement {
  static styles = css`${tokens}

    :host {
      display: block;
    }

    .tool-card {
      display: flex;
      align-items: center;
      gap: var(--ask-radius, 0.5rem);
      padding: var(--ask-radius-small, 0.375rem) 0.75rem;
      border-radius: 0.75rem;
      font-size: 0.8125rem;
      line-height: 1.5;
      color: var(--ask-text-faint, #525252);
      background: var(--ask-surface-muted, #fafafa);
      border: 1px solid var(--ask-border, #e5e5e5);
      transition: background 0.15s, border-color 0.15s;
    }
    .tool-card--failed {
      color: var(--ask-danger-text, #991b1b);
      background: var(--ask-danger-bg, #fef2f2);
      border-color: var(--ask-danger-border, #fecaca);
    }

    .tool-icon {
      flex-shrink: 0;
      font-size: 0.875rem;
    }
    .tool-icon--running {
      animation: tool-spin 1s linear infinite;
    }

    .tool-name {
      font-weight: 500;
      color: var(--ask-border-strong, #404040);
    }
    .tool-card--failed .tool-name {
      color: var(--ask-danger-text, #991b1b);
    }

    .tool-status {
      color: var(--ask-text-muted, #a3a3a3);
    }
    .tool-card--failed .tool-status {
      color: var(--ask-danger-text, #fca5a5);
    }

    .tool-duration {
      margin-left: auto;
      font-family: monospace;
      font-size: 0.6875rem;
      color: var(--ask-text-muted, #a3a3a3);
    }

    @keyframes tool-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    
    
  `;

  @property({ type: String }) name = "Tool";
  @property({ type: String }) status: ToolStatus = "running";
  @property({ type: Number }) duration = 0;

  render() {
    const isFailed = this.status === "failed";
    const isDone = this.status === "done";

    let icon: string;
    let iconClass: string;
    let statusLabel: string;

    if (isDone) {
      icon = "✓";
      iconClass = "";
      statusLabel = "done";
    } else if (isFailed) {
      icon = "✕";
      iconClass = "";
      statusLabel = "failed";
    } else {
      icon = "⚙";
      iconClass = "tool-icon--running";
      statusLabel = "running";
    }

    const durationText = this.duration > 0 ? `${this.duration}ms` : "";

    return html`
      <div class="tool-card ${isFailed ? "tool-card--failed" : ""}">
        <span class="tool-icon ${iconClass}">${icon}</span>
        <span class="tool-name">${this.name}</span>
        <span class="tool-status">${statusLabel}</span>
        ${durationText ? html`<span class="tool-duration">${durationText}</span>` : ""}
      </div>
    `;
  }
}

customElements.define("ask-tool-call", AskToolCall);

declare global {
  interface HTMLElementTagNameMap {
    "ask-tool-call": AskToolCall;
  }
}
