import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { property } from "lit/decorators.js";

/**
 * AskTerminalOutput — collapsible monospace output (tool results, logs).
 *
 * Long output is clamped to `maxLines` with an expand/collapse toggle and
 * a copy button. ANSI escape sequences are stripped.
 *
 *   <ask-terminal-output output="stdout line 1&#10;stderr line 2"></ask-terminal-output>
 */
export class AskTerminalOutput extends LitElement {
  static styles = css`${tokens}

    :host {
      display: block;
    }

    .terminal {
      border: 1px solid var(--ask-border, #e5e5e5);
      border-radius: 0.75rem;
      overflow: hidden;
      background: #0c0c0c;
    }

    .bar {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.375rem 0.75rem;
      background: #161616;
      border-bottom: 1px solid #262626;
    }
    .bar .label {
      font-size: 0.6875rem;
      color: #a3a3a3;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }
    .bar .count {
      font-size: 0.6875rem;
      color: #737373;
    }
    .bar button {
      margin-left: auto;
      font: inherit;
      font-size: 0.6875rem;
      padding: 0.25rem 0.5rem;
      border-radius: 0.375rem;
      border: 1px solid #333;
      background: transparent;
      color: #d4d4d4;
      cursor: pointer;
    }
    .bar button:hover { background: #262626; }

    .output {
      margin: 0;
      padding: 0.75rem;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.6875rem;
      line-height: 1.6;
      color: #d4d4d4;
      white-space: pre-wrap;
      word-break: break-word;
      max-height: 24rem;
      overflow-y: auto;
    }

    .output--empty {
      color: #737373;
      font-family: var(--ask-font, ui-sans-serif, system-ui, sans-serif);
      font-size: 0.75rem;
    }
  `;

  @property({ type: String }) output = "";
  @property({ type: Number, attribute: "max-lines" }) maxLines = 8;
  @property({ type: Boolean }) expanded = false;

  render() {
    const clean = this.output.replace(/\x1b\[[0-9;]*m/g, "");
    if (!clean) {
      return html`<div class="terminal"><div class="output output--empty">No output</div></div>`;
    }

    const lines = clean.split("\n");
    const clamped = !this.expanded && lines.length > this.maxLines;
    const visible = clamped ? lines.slice(0, this.maxLines) : lines;
    const clampedHeight = `calc(${this.maxLines} * 1.1rem)`;

    return html`
      <div class="terminal">
        <div class="bar">
          <span class="label">Terminal</span>
          <span class="count">${lines.length} lines</span>
          <button @click=${this._copy}>Copy</button>
          ${clamped ? html`<button @click=${this._toggle}>Show all</button>` : ""}
        </div>
        <pre class="output" style=${clamped ? `max-height: ${clampedHeight}` : ""}>${visible.join("\n")}</pre>
      </div>`;
  }

  private _toggle() {
    this.expanded = !this.expanded;
  }

  private async _copy() {
    try {
      await navigator.clipboard.writeText(this.output);
    } catch {
      // Clipboard unavailable (non-secure context) — fall back to select.
      const el = this.shadowRoot?.querySelector(".output");
      const range = document.createRange();
      if (el) {
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }
    }
  }
}

customElements.define("ask-terminal-output", AskTerminalOutput);
