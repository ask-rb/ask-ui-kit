import { LitElement, html, css } from "lit";
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
  static styles = css`
    :host {
      display: block;
    }

    .markdown-content {
      font-size: 0.875rem;
      line-height: 1.75;
      color: var(--ask-markdown-text, #171717);
      word-wrap: break-word;
    }

    .markdown-content code {
      background: var(--ask-markdown-code-bg, #f5f5f5);
      padding: 0.125rem 0.375rem;
      border-radius: 0.25rem;
      font-family: "SF Mono", Monaco, Menlo, monospace;
      font-size: 0.8125em;
      color: var(--ask-markdown-code-text, #404040);
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

    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      :host {
        --ask-markdown-text: var(--ask-markdown-text-dark, #e5e5e5);
        --ask-markdown-code-bg: var(--ask-markdown-code-bg-dark, #1a1a1a);
        --ask-markdown-code-text: var(--ask-markdown-code-text-dark, #e5e5e5);
        --ask-markdown-link: var(--ask-markdown-link-dark, #60a5fa);
      }
    }
    :host-context(.dark) {
      --ask-markdown-text: var(--ask-markdown-text-dark, #e5e5e5);
      --ask-markdown-code-bg: var(--ask-markdown-code-bg-dark, #1a1a1a);
      --ask-markdown-code-text: var(--ask-markdown-code-text-dark, #e5e5e5);
      --ask-markdown-link: var(--ask-markdown-link-dark, #60a5fa);
    }
    :host-context(.light) {
      --ask-markdown-text: var(--ask-markdown-text-light, #171717);
      --ask-markdown-code-bg: var(--ask-markdown-code-bg-light, #f5f5f5);
      --ask-markdown-code-text: var(--ask-markdown-code-text-light, #404040);
      --ask-markdown-link: var(--ask-markdown-link-light, #3b82f6);
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
