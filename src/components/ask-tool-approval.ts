import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { property } from "lit/decorators.js";

export type ApprovalStatus = "pending" | "approved" | "rejected";

/**
 * AskToolApproval — a tool action awaiting human approval.
 *
 * Renders the tool name, arguments, and a message; pending actions get
 * Approve / Reject buttons that dispatch `approval-approved` and
 * `approval-rejected` CustomEvents (detail: { id }). Resolved actions
 * render as a status chip instead.
 *
 *   <ask-tool-approval action-id="7" tool-name="bash"
 *     args='{"command":"rm -rf node_modules"}'></ask-tool-approval>
 *
 * Events:
 *   approval-approved  { id }
 *   approval-rejected  { id }
 */
export class AskToolApproval extends LitElement {
  static styles = css`${tokens}

    :host {
      display: block;
    }

    .approval {
      border: 1px solid var(--ask-border, #e5e5e5);
      border-radius: 0.75rem;
      background: var(--ask-surface-muted, #fafafa);
      overflow: hidden;
    }

    .approval--pending {
      border-color: var(--ask-accent, #c2410c);
    }

    .head {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      font-size: 0.8125rem;
    }
    .head .icon { font-size: 0.875rem; }
    .head .tool-name {
      font-weight: 600;
      color: var(--ask-border-strong, #404040);
    }
    .head .status-chip {
      margin-left: auto;
      font-size: 0.6875rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 0.125rem 0.5rem;
      border-radius: 999px;
    }
    .status-chip--pending {
      color: var(--ask-accent-text, #fafafa);
      background: var(--ask-accent, #c2410c);
    }
    .status-chip--approved { color: #14532d; background: #dcfce7; }
    .status-chip--rejected { color: #7f1d1d; background: #fee2e2; }

    .args {
      margin: 0 0.75rem 0.5rem;
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      background: var(--ask-surface, #ffffff);
      border: 1px solid var(--ask-border, #e5e5e5);
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.6875rem;
      line-height: 1.6;
      color: var(--ask-text-faint, #737373);
      white-space: pre-wrap;
      word-break: break-word;
      max-height: 10rem;
      overflow-y: auto;
    }

    .message {
      margin: 0 0.75rem 0.5rem;
      font-size: 0.75rem;
      color: var(--ask-text-faint, #737373);
    }

    .actions {
      display: flex;
      gap: 0.5rem;
      padding: 0 0.75rem 0.75rem;
    }
    .actions button {
      flex: 1;
      font: inherit;
      font-size: 0.8125rem;
      font-weight: 600;
      padding: 0.5rem 0.75rem;
      border-radius: 0.5rem;
      border: 1px solid var(--ask-border-strong, #d4d4d4);
      cursor: pointer;
      transition: filter 0.15s, border-color 0.15s;
    }
    .actions button:hover { filter: brightness(0.97); }
    .actions button:active { transform: translateY(1px); }
    .btn-approve {
      background: var(--ask-accent, #c2410c);
      border-color: var(--ask-accent, #c2410c);
      color: var(--ask-accent-text, #fafafa);
    }
    .btn-reject {
      background: var(--ask-surface, #ffffff);
      color: var(--ask-danger-text, #991b1b);
      border-color: var(--ask-danger-border, #fecaca);
    }
  `;

  @property({ type: Number, attribute: "action-id" }) actionId = 0;
  @property({ type: String, attribute: "tool-name" }) toolName = "Tool";
  @property({ type: String }) args = "";
  @property({ type: String }) message = "";
  @property({ type: String }) status: ApprovalStatus = "pending";

  render() {
    const pending = this.status === "pending";

    const chip =
      this.status === "pending"
        ? html`<span class="status-chip status-chip--pending">Awaiting approval</span>`
        : this.status === "approved"
          ? html`<span class="status-chip status-chip--approved">Approved</span>`
          : html`<span class="status-chip status-chip--rejected">Rejected</span>`;

    return html`
      <div class="approval ${pending ? "approval--pending" : ""}">
        <div class="head">
          <span class="icon">✋</span>
          <span class="tool-name">${this.toolName}</span>
          ${chip}
        </div>
        ${this.args ? html`<pre class="args">${this.args}</pre>` : ""}
        ${this.message ? html`<div class="message">${this.message}</div>` : ""}
        ${pending ? html`
          <div class="actions">
            <button class="btn-approve" @click=${this._approve}>Approve</button>
            <button class="btn-reject" @click=${this._reject}>Reject</button>
          </div>
        ` : ""}
      </div>`;
  }

  private _approve() {
    this.dispatchEvent(new CustomEvent("approval-approved", { detail: { id: this.actionId }, bubbles: true, composed: true }));
  }

  private _reject() {
    this.dispatchEvent(new CustomEvent("approval-rejected", { detail: { id: this.actionId }, bubbles: true, composed: true }));
  }
}

customElements.define("ask-tool-approval", AskToolApproval);
