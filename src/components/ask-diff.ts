import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { property } from "lit/decorators.js";

/**
 * AskDiff — unified diff viewer for coding agents.
 *
 * Parses unified diff text (git-style: `---`/`+++` headers, `@@` hunks,
 * `+`/`-`/` ` lines) and renders it inline with line numbers and
 * add/remove coloring. Fully self-contained — give it a diff string.
 *
 *   <ask-diff diff="--- a/file.rb&#10;+++ b/file.rb&#10;@@ -1,3 +1,4 @@&#10; old&#10;+new"></ask-diff>
 *
 * Events: none.
 */
export class AskDiff extends LitElement {
  static styles = css`${tokens}

    :host {
      display: block;
    }

    .diff {
      margin: 0;
      border: 1px solid var(--ask-border, #e5e5e5);
      border-radius: 0.75rem;
      overflow: hidden;
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      font-size: 0.75rem;
      line-height: 1.6;
      background: var(--ask-surface-muted, #fafafa);
    }

    .file-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      font-size: 0.6875rem;
      font-weight: 600;
      color: var(--ask-text-faint, #737373);
      background: var(--ask-surface, #ffffff);
      border-bottom: 1px solid var(--ask-border, #e5e5e5);
    }

    .file-header .hunk-count {
      margin-left: auto;
      font-weight: 400;
    }

    .hunk {
      padding: 0.25rem 0;
      border-top: 1px solid var(--ask-border, #e5e5e5);
    }
    .hunk:first-of-type {
      border-top: none;
    }

    .hunk-header {
      padding: 0.25rem 0.75rem;
      color: var(--ask-text-faint, #737373);
      background: var(--ask-surface-hover, #f5f5f5);
      font-size: 0.6875rem;
    }

    .line {
      display: grid;
      grid-template-columns: 3.5rem 3.5rem 1fr;
      gap: 0;
      padding: 0 0.75rem;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .line .old-no, .line .new-no {
      color: var(--ask-text-muted, #a3a3a3);
      user-select: none;
      text-align: right;
      padding-right: 0.75rem;
    }
    .line .content {
      min-width: 0;
    }

    .line--add {
      background: var(--ask-diff-add-bg, #f0fdf4);
      color: var(--ask-diff-add-text, #14532d);
    }
    .line--del {
      background: var(--ask-diff-del-bg, #fef2f2);
      color: var(--ask-diff-del-text, #7f1d1d);
    }
    :host([theme="dark"]) .line--add { background: var(--ask-diff-add-bg-dark, #052e16); color: var(--ask-diff-add-text-dark, #86efac); }
    :host([theme="dark"]) .line--del { background: var(--ask-diff-del-bg-dark, #450a0a); color: var(--ask-diff-del-text-dark, #fca5a5); }
    .line--add .marker, .line--del .marker {
      font-weight: 700;
      width: 0.875rem;
      flex-shrink: 0;
    }
    .line .content {
      display: inline-flex;
    }

    .diff--empty {
      padding: 0.75rem;
      color: var(--ask-text-muted, #a3a3a3);
      font-family: var(--ask-font, ui-sans-serif, system-ui, sans-serif);
      font-size: 0.8125rem;
    }
  `;

  @property({ type: String }) diff = "";
  @property({ type: String }) filename = "";

  render() {
    const parsed = parseDiff(this.diff);
    if (parsed.lines.length === 0 && !this.filename) {
      return html`<pre class="diff"><div class="diff--empty">No changes</div></pre>`;
    }

    const fileHeader = this.filename
      ? html`<div class="file-header"><span>${this.filename}</span><span class="hunk-count">+${parsed.adds} −${parsed.dels}</span></div>`
      : parsed.fileNames.length > 0
        ? html`<div class="file-header"><span>${parsed.fileNames.join(" → ")}</span><span class="hunk-count">+${parsed.adds} −${parsed.dels}</span></div>`
        : "";

    return html`
      <div class="diff">
        ${fileHeader}
        ${parsed.hunks.map((hunk) => html`
          <div class="hunk">
            <div class="hunk-header">${hunk.header}</div>
            ${hunk.lines.map((line) => {
              const cls = line.type === "add" ? "line--add" : line.type === "del" ? "line--del" : "";
              const marker = line.type === "add" ? "+" : line.type === "del" ? "−" : " ";
              return html`
                <div class="line ${cls}">
                  <span class="old-no">${line.oldNo ?? ""}</span>
                  <span class="new-no">${line.newNo ?? ""}</span>
                  <span class="content"><span class="marker">${marker}</span>${line.text}</span>
                </div>`;
            })}
          </div>
        `)}
      </div>`;
  }
}

interface DiffLine {
  type: "add" | "del" | "ctx";
  text: string;
  oldNo: number | null;
  newNo: number | null;
}

interface DiffHunk {
  header: string;
  lines: DiffLine[];
}

interface ParsedDiff {
  hunks: DiffHunk[];
  lines: DiffLine[];
  fileNames: string[];
  adds: number;
  dels: number;
}

/** Parse a unified diff into hunks. Non-hunk text (headers) is dropped. */
export function parseDiff(diff: string): ParsedDiff {
  const hunks: DiffHunk[] = [];
  const fileNames: string[] = [];
  let adds = 0;
  let dels = 0;

  let current: DiffHunk | null = null;
  let oldLine = 0;
  let newLine = 0;

  for (const raw of diff.split("\n")) {
    const line = raw.replace(/\r$/, "");

    if (line.startsWith("+++ ") || line.startsWith("--- ")) {
      fileNames.push(line.slice(4).replace(/^[ab]\//, ""));
      continue;
    }

    if (line.startsWith("@@")) {
      current = { header: line, lines: [] };
      hunks.push(current);
      const m = line.match(/@@ -(\d+)(?:,\d+)? \+(\d+)(?:,\d+)? @@/);
      oldLine = m ? parseInt(m[1], 10) : 0;
      newLine = m ? parseInt(m[2], 10) : 0;
      continue;
    }

    if (!current) continue;

    if (line.startsWith("+")) {
      current.lines.push({ type: "add", text: line.slice(1), oldNo: null, newNo: newLine });
      newLine += 1;
      adds += 1;
    } else if (line.startsWith("-")) {
      current.lines.push({ type: "del", text: line.slice(1), oldNo: oldLine, newNo: null });
      oldLine += 1;
      dels += 1;
    } else {
      current.lines.push({ type: "ctx", text: line.slice(1), oldNo: oldLine, newNo: newLine });
      oldLine += 1;
      newLine += 1;
    }
  }

  const lines = hunks.flatMap((h) => h.lines);
  return { hunks, lines, fileNames, adds, dels };
}

customElements.define("ask-diff", AskDiff);
