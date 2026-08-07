import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { tokens } from "../styles/tokens.js";

/**
 * RFC 8628 device authorization UI — the "open a URL, enter a code,
 * authorize" dance for OAuth device flows (xAI, GitHub Copilot, and any
 * other provider that uses the device grant). Dumb and framework-agnostic:
 * data in as attributes, the completion click out as `ask-authorize`.
 *
 *   <ask-device-auth
 *     verification-uri="https://auth.x.ai/activate"
 *     user-code="ABCD-EFGH"
 *     pending>
 *   </ask-device-auth>
 *
 * Listen for `ask-authorize` (bubbles, composed) to poll the token
 * endpoint; pass the `pending` attribute while authorization is pending to
 * show the "not authorized yet" note.
 */
export class AskDeviceAuth extends LitElement {
  static styles = css`
    ${tokens}

    :host {
      display: block;
      font-family: var(--ask-font, inherit);
      color: var(--ask-text, #171717);
    }

    .notice {
      margin-bottom: var(--ask-radius, 0.5rem);
      padding: 0.625rem 1rem;
      border-radius: var(--ask-radius, 0.5rem);
      border: 1px solid var(--ask-warning-border, #fcd34d);
      background: var(--ask-warning-bg, #fffbeb);
      color: var(--ask-warning-text, #92400e);
      font-size: 0.8125rem;
    }

    ol {
      margin: 0;
      padding-left: 1.25rem;
      display: grid;
      gap: var(--ask-spacing, 0.75rem);
      font-size: 0.875rem;
      line-height: 1.5;
    }

    a {
      color: var(--ask-accent, #c2410c);
      text-decoration: underline;
      word-break: break-all;
    }

    .code {
      margin-top: 0.25rem;
      font-size: 1.5rem;
      font-weight: 600;
      letter-spacing: 0.2em;
      color: var(--ask-accent, #c2410c);
    }

    .authorize {
      margin-top: 0.375rem;
      padding: 0.5rem 1rem;
      border: 0;
      border-radius: var(--ask-radius, 0.5rem);
      background: var(--ask-accent, #c2410c);
      color: var(--ask-accent-text, #fafafa);
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: opacity 0.1s;
    }
    .authorize:hover {
      opacity: 0.9;
    }

    .meta {
      margin-top: 1rem;
      font-size: 0.75rem;
      color: var(--ask-text-muted, #a3a3a3);
    }
  `;

  /** The URL the user opens on any device with a browser. */
  @property({ type: String, attribute: "verification-uri" }) verificationUri = "";

  /** The short code the user enters on the provider's site. */
  @property({ type: String, attribute: "user-code" }) userCode = "";

  /** Show the "not authorized yet" note (poll returned pending). */
  @property({ type: Boolean, reflect: true }) pending = false;

  /** Optional expiry hint, e.g. "in 5 minutes". */
  @property({ type: String, attribute: "expires-label" }) expiresLabel = "";

  private _authorize() {
    this.dispatchEvent(
      new CustomEvent("ask-authorize", { bubbles: true, composed: true })
    );
  }

  render() {
    return html`
      ${this.pending
        ? html`<div class="notice">
            Not authorized yet — open the link, enter the code, then try again.
          </div>`
        : ""}

      <ol>
        <li>
          <span style="font-weight:500">1. Open this link</span> on any device
          with a browser:
          <div>
            <a href=${this.verificationUri} target="_blank" rel="noopener">${this.verificationUri}</a>
          </div>
        </li>
        <li>
          <span style="font-weight:500">2. Enter this code:</span>
          <div class="code">${this.userCode}</div>
        </li>
        <li>
          <span style="font-weight:500">3. Authorize, then come back and finish:</span>
          <div>
            <button class="authorize" @click=${this._authorize} part="authorize-button">
              I've authorized — complete
            </button>
          </div>
        </li>
      </ol>

      ${this.expiresLabel
        ? html`<p class="meta">The code expires ${this.expiresLabel}. Your tokens are encrypted at rest.</p>`
        : ""}
    `;
  }
}

customElements.define("ask-device-auth", AskDeviceAuth);

declare global {
  interface HTMLElementTagNameMap {
    "ask-device-auth": AskDeviceAuth;
  }
}
