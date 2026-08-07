import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { property } from "lit/decorators.js";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function parseInlineMarkdown(text: string): string {
  // Escape HTML first
  let result = escapeHtml(text);

  // Inline code: `code` (do this first to avoid processing inside code)
  result = result.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Bold: **text**
  result = result.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // Italic: *text*
  result = result.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // Links: [text](url)
  result = result.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // Line breaks
  result = result.replace(/\n/g, "<br>");

  return result;
}

export class AskMarkdown extends LitElement {
  static styles = css`${tokens}

    :host {
      display: block;
    }

    .markdown-content {
      font-size: 0.875rem;
      line-height: 1.75;
      color: var(--ask-text, #171717);
      word-wrap: break-word;
    }

    .markdown-content code {
      background: var(--ask-text, #f5f5f5);
      padding: 0.125rem var(--ask-radius-small, 0.375rem);
      border-radius: 0.25rem;
      font-family: "SF Mono", Monaco, Menlo, monospace;
      font-size: 0.8125em;
      color: var(--ask-border-strong, #404040);
    }

    .markdown-content a {
      color: var(--ask-markdown-link, #3b82f6);
      text-decoration: underline;
    }
    .markdown-content a:hover {
      opacity: 0.8;
    }

    .markdown-content strong {
      font-weight: 600;
    }

    .markdown-content em {
      font-style: italic;
    }

    .markdown-content br {
      content: "";
      display: block;
      margin: 0.25rem 0;
    }

    
    
  `;

  @property({ type: String }) content = "";
  @property({ type: String }) html = "";

  render() {
    if (this.html) {
      return html`
        <div class="markdown-content">${unsafeHTML(this.html)}</div>
      `;
    }

    if (!this.content) {
      return html``;
    }

    const rendered = parseInlineMarkdown(this.content);
    return html`
      <div class="markdown-content">${unsafeHTML(rendered)}</div>
    `;
  }
}

customElements.define("ask-markdown", AskMarkdown);

declare global {
  interface HTMLElementTagNameMap {
    "ask-markdown": AskMarkdown;
  }
}
