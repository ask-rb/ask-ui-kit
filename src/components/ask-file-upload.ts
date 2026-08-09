import { LitElement, html, css } from "lit";
import { tokens } from "../styles/tokens.js";
import { property, query } from "lit/decorators.js";

export interface FileEntry {
  name: string;
  size: number;
  type: string;
  src?: string; // data URL or blob URL for preview
}

export class AskFileUpload extends LitElement {
  static styles = css`${tokens}

    :host {
      display: block;
    }

    .dropzone {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--ask-radius, 0.5rem);
      padding: 1.5rem 1rem;
      border: 2px dashed var(--ask-border-strong, #d4d4d4);
      border-radius: 0.75rem;
      background: var(--ask-surface-muted, #fafafa);
      color: var(--ask-text-muted, #a3a3a3);
      font-size: 0.8125rem;
      cursor: pointer;
      transition: border-color 0.15s, background 0.15s;
      text-align: center;
    }
    .dropzone:hover {
      border-color: var(--ask-text-muted, #a3a3a3);
      background: var(--ask-surface-hover, #f5f5f5);
    }
    .dropzone:has(input:focus-visible) {
      border-color: var(--ask-text-muted, #a3a3a3);
    }
    .dropzone--disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .dropzone-icon {
      font-size: 1.5rem;
    }

    .dropzone-input {
      display: none;
    }

    .file-list {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ask-radius, 0.5rem);
      margin-top: var(--ask-radius, 0.5rem);
    }

    
    
  `;

  @property({ type: String }) accept = "";
  @property({ type: Boolean }) multiple = true;
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) files = ""; // JSON string of FileEntry[]

  @query(".dropzone-input", true) private _input!: HTMLInputElement;

  // Keyboard support for the dropzone (Enter/Space open the file picker).
private _handleKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" || e.key === " ") {
    e.preventDefault();
    this._handleClick();
  }
}
private _handleClick() {
    if (this.disabled) return;
    this._input.click();
  }

  private _handleFileChange(e: Event) {
    const input = e.target as HTMLInputElement;
    const fileList = input.files;
    if (!fileList || fileList.length === 0) return;

    const entries: FileEntry[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const entry: FileEntry = {
        name: file.name,
        size: file.size,
        type: file.type,
      };
      if (file.type.startsWith("image/")) {
        entry.src = URL.createObjectURL(file);
      }
      entries.push(entry);
    }

    // Merge with existing
    const existing = this._parsedFiles();
    const merged = [...existing, ...entries];

    this.files = JSON.stringify(merged);
    input.value = ""; // reset so same file can be re-selected

    this.dispatchEvent(
      new CustomEvent("ask-files-select", {
        detail: { files: entries },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _handleRemove(e: CustomEvent) {
    const name = e.detail.name;
    const existing = this._parsedFiles().filter((f) => f.name !== name);
    this.files = JSON.stringify(existing);

    this.dispatchEvent(
      new CustomEvent("ask-file-remove", {
        detail: { name },
        bubbles: true,
        composed: true,
      })
    );
  }

  private _parsedFiles(): FileEntry[] {
    try {
      const parsed = JSON.parse(this.files);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      // ignore
    }
    return [];
  }

  render() {
    const fileEntries = this._parsedFiles();

    return html`
      <div class="dropzone ${this.disabled ? "dropzone--disabled" : ""}" role="button" tabindex="0" aria-disabled=${this.disabled} @click=${this._handleClick} @keydown=${this._handleKeydown}>
        <div class="dropzone-icon">📎</div>
        <div>Click to attach files</div>
        <input
          class="dropzone-input"
          type="file"
          ?multiple=${this.multiple}
          accept=${this.accept}
          ?disabled=${this.disabled}
          @change=${this._handleFileChange}
        />
      </div>
      ${fileEntries.length > 0
        ? html`
            <div class="file-list">
              ${fileEntries.map(
                (f) => html`
                  <ask-attachment
                    name=${f.name}
                    size=${f.size}
                    type=${f.type}
                    src=${f.src || ""}
                    removable
                    @ask-remove=${this._handleRemove}
                  ></ask-attachment>
                `
              )}
            </div>
          `
        : ""
      }
    `;
  }
}

customElements.define("ask-file-upload", AskFileUpload);

declare global {
  interface HTMLElementTagNameMap {
    "ask-file-upload": AskFileUpload;
  }
}
