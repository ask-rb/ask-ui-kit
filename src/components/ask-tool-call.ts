import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";

export type ToolStatus = "running" | "done" | "failed";

export class AskToolCall extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .tool-card {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.75rem;
      border-radius: 0.75rem;
      font-size: 0.8125rem;
      line-height: 1.5;
      color: var(--ask-tool-text, #525252);
      background: var(--ask-tool-bg, #fafafa);
      border: 1px solid var(--ask-tool-border, #e5e5e5);
      transition: background 0.15s, border-color 0.15s;
    }
    .tool-card--failed {
      color: var(--ask-tool-error-text, #991b1b);
      background: var(--ask-tool-error-bg, #fef2f2);
      border-color: var(--ask-tool-error-border, #fecaca);
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
      color: var(--ask-tool-name, #404040);
    }
    .tool-card--failed .tool-name {
      color: var(--ask-tool-error-name, #991b1b);
    }

    .tool-status {
      color: var(--ask-tool-muted, #a3a3a3);
    }
    .tool-card--failed .tool-status {
      color: var(--ask-tool-error-muted, #fca5a5);
    }

    .tool-duration {
      margin-left: auto;
      font-family: monospace;
      font-size: 0.6875rem;
      color: var(--ask-tool-muted, #a3a3a3);
    }

    @keyframes tool-spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      :host {
        --ask-tool-bg: var(--ask-tool-bg-dark, #1a1a1a);
        --ask-tool-border: var(--ask-tool-border-dark, #262626);
        --ask-tool-text: var(--ask-tool-text-dark, #a3a3a3);
        --ask-tool-name: var(--ask-tool-name-dark, #e5e5e5);
        --ask-tool-muted: var(--ask-tool-muted-dark, #525252);
        --ask-tool-error-bg: var(--ask-tool-error-bg-dark, #450a0a);
        --ask-tool-error-border: var(--ask-tool-error-border-dark, #7f1d1d);
        --ask-tool-error-text: var(--ask-tool-error-text-dark, #fca5a5);
        --ask-tool-error-name: var(--ask-tool-error-name-dark, #fca5a5);
        --ask-tool-error-muted: var(--ask-tool-error-muted-dark, #7f1d1d);
      }
    }
    :host-context(.dark) {
      --ask-tool-bg: var(--ask-tool-bg-dark, #1a1a1a);
      --ask-tool-border: var(--ask-tool-border-dark, #262626);
      --ask-tool-text: var(--ask-tool-text-dark, #a3a3a3);
      --ask-tool-name: var(--ask-tool-name-dark, #e5e5e5);
      --ask-tool-muted: var(--ask-tool-muted-dark, #525252);
      --ask-tool-error-bg: var(--ask-tool-error-bg-dark, #450a0a);
      --ask-tool-error-border: var(--ask-tool-error-border-dark, #7f1d1d);
      --ask-tool-error-text: var(--ask-tool-error-text-dark, #fca5a5);
      --ask-tool-error-name: var(--ask-tool-error-name-dark, #fca5a5);
      --ask-tool-error-muted: var(--ask-tool-error-muted-dark, #7f1d1d);
    }
    :host-context(.light) {
      --ask-tool-bg: var(--ask-tool-bg-light, #fafafa);
      --ask-tool-border: var(--ask-tool-border-light, #e5e5e5);
      --ask-tool-text: var(--ask-tool-text-light, #525252);
      --ask-tool-name: var(--ask-tool-name-light, #404040);
      --ask-tool-muted: var(--ask-tool-muted-light, #a3a3a3);
      --ask-tool-error-bg: var(--ask-tool-error-bg-light, #fef2f2);
      --ask-tool-error-border: var(--ask-tool-error-border-light, #fecaca);
      --ask-tool-error-text: var(--ask-tool-error-text-light, #991b1b);
      --ask-tool-error-name: var(--ask-tool-error-name-light, #991b1b);
      --ask-tool-error-muted: var(--ask-tool-error-muted-light, #fca5a5);
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
