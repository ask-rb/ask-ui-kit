import { LitElement, html, css, nothing } from "lit";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { property } from "lit/decorators.js";
import { tokens } from "../styles/tokens.js";

const ICONS: Record<string, string> = {
  explore: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M3 11l19-9-9 19-2-8-8-2z"/>
    </svg>`,
  build: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>`,
  review: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M21 12a9 9 0 1 1-9-9"/>
      <path d="M12 6v6l3 3"/>
    </svg>`,
  fix: `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="8" y="8" width="8" height="8" rx="1.5"/>
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2"/>
    </svg>`,
};

/**
 * A clickable prompt card — the Codex-style suggestion grid tile: a
 * colored icon over a short label, filling empty states with the things
 * a user can ask. Variants carry their own icon and accent color, or
 * pass `variant="custom"` with an icon in the default slot.
 *
 * Clicking emits `ask-prompt` ({label, variant}) so the host can fill
 * the input or submit directly.
 */
export class AskPromptCard extends LitElement {
  static styles = css`${tokens}

    :host {
      display: block;
    }

    .card {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
      width: 100%;
      padding: 1rem;
      border: 1px solid var(--ask-border, #e5e5e5);
      border-radius: var(--ask-radius, 0.5rem);
      background: var(--ask-surface-muted, #f5f5f5);
      color: var(--ask-text, #171717);
      font-family: var(--ask-font, inherit);
      font-size: var(--ask-font-size, 0.8125rem);
      text-align: left;
      cursor: pointer;
      transition: border-color 0.15s, background 0.15s;
    }
    .card:hover {
      border-color: var(--ask-border-strong, #d4d4d4);
      background: var(--ask-surface-hover, #f5f5f5);
    }
    .card:focus-visible {
      outline: 2px solid var(--ask-focus, #a3a3a3);
      outline-offset: 1px;
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.5rem;
      height: 1.5rem;
      color: var(--ask-prompt-accent, var(--ask-accent, #c2410c));
    }
    .icon svg {
      width: 100%;
      height: 100%;
    }

    .label {
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1.35;
      color: var(--ask-text, #171717);
    }

    .description {
      margin-top: 0.25rem;
      font-size: 0.75rem;
      color: var(--ask-text-muted, #a3a3a3);
      line-height: 1.4;
    }
  `;

  /** Which built-in icon + accent to use: explore | build | review | fix | custom. */
  @property({ type: String }) variant = "explore";
  @property({ type: String }) label = "";
  @property({ type: String }) description = "";

  private _accent() {
    const colors: Record<string, string> = {
      explore: "var(--ask-prompt-explore, #4f9cf9)",
      build: "var(--ask-prompt-build, #a78bfa)",
      review: "var(--ask-prompt-review, #34d399)",
      fix: "var(--ask-prompt-fix, #fb923c)",
      custom: "var(--ask-prompt-custom, var(--ask-accent, #c2410c))",
    };
    return colors[this.variant] ?? colors.custom;
  }

  private _icon() {
    if (this.variant === "custom") return nothing;
    return html`<span class="icon" part="icon">${unsafeHTML(ICONS[this.variant] ?? ICONS.explore)}</span>`;
  }

  private _click() {
    this.dispatchEvent(
      new CustomEvent("ask-prompt", {
        detail: { label: this.label, variant: this.variant },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <button class="card" style="--ask-prompt-accent: ${this._accent()}" @click=${this._click}>
        ${this.variant === "custom" ? html`<span class="icon" part="icon"><slot></slot></span>` : this._icon()}
        <span class="label">${this.label}</span>
        ${this.description ? html`<span class="description">${this.description}</span>` : nothing}
      </button>
    `;
  }
}

customElements.define("ask-prompt-card", AskPromptCard);

declare global {
  interface HTMLElementTagNameMap {
    "ask-prompt-card": AskPromptCard;
  }
}
