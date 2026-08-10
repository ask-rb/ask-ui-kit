import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { property } from "lit/decorators.js";

export type PlanStatus = "proposed" | "approved" | "rejected";

/**
 * AskPlan — a plan proposed by the agent in plan mode.
 *
 * Pending plans render with Approve / Reject buttons that dispatch
 * `plan-approved` / `plan-rejected` CustomEvents.
 *
 *   <ask-plan plan="Step 1: …&#10;Step 2: …"></ask-plan>
 *
 * Events:
 *   plan-approved  { plan }
 *   plan-rejected  { plan }
 */
export class AskPlan extends LitElement {
  static styles = css`${tokens}

    :host {
      display: block;
    }

    .plan {
      border: 1px solid var(--ask-accent, #c2410c);
      border-radius: 0.75rem;
      overflow: hidden;
      background: var(--ask-surface-muted, #fafafa);
    }

    .head {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--ask-border-strong, #404040);
      background: var(--ask-surface, #ffffff);
      border-bottom: 1px solid var(--ask-border, #e5e5e5);
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
    .status-chip--proposed { color: var(--ask-accent-text, #fafafa); background: var(--ask-accent, #c2410c); }
    .status-chip--approved { color: #14532d; background: #dcfce7; }
    .status-chip--rejected { color: #7f1d1d; background: #fee2e2; }

    .body {
      margin: 0;
      padding: 0.75rem;
      font-size: 0.8125rem;
      line-height: 1.6;
      color: var(--ask-text, #171717);
      white-space: pre-wrap;
      word-break: break-word;
      font-family: var(--ask-font, ui-sans-serif, system-ui, sans-serif);
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
    }
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

  @property({ type: String }) plan = "";
  @property({ type: String }) status: PlanStatus = "proposed";

  render() {
    const pending = this.status === "proposed";
    const chip =
      this.status === "proposed"
        ? html`<span class="status-chip status-chip--proposed">Proposed</span>`
        : this.status === "approved"
          ? html`<span class="status-chip status-chip--approved">Approved</span>`
          : html`<span class="status-chip status-chip--rejected">Rejected</span>`;

    return html`
      <div class="plan">
        <div class="head">
          <span>📋 Plan</span>
          ${chip}
        </div>
        <pre class="body">${this.plan}</pre>
        ${pending ? html`
          <div class="actions">
            <button class="btn-approve" @click=${this._approve}>Approve plan</button>
            <button class="btn-reject" @click=${this._reject}>Reject plan</button>
          </div>
        ` : ""}
      </div>`;
  }

  private _approve() {
    this.dispatchEvent(new CustomEvent("plan-approved", { detail: { plan: this.plan }, bubbles: true, composed: true }));
  }

  private _reject() {
    this.dispatchEvent(new CustomEvent("plan-rejected", { detail: { plan: this.plan }, bubbles: true, composed: true }));
  }
}

customElements.define("ask-plan", AskPlan);
