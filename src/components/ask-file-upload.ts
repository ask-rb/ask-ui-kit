import { LitElement, html, css } from "lit";
import { property, query } from "lit/decorators.js";

export interface FileEntry {
  name: string;
  size: number;
  type: string;
  src?: string; // data URL or blob URL for preview
}

export class AskFileUpload extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .dropzone {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 1.5rem 1rem;
      border: 2px dashed var(--ask-upload-border, #d4d4d4);
      border-radius: 0.75rem;
      background: var(--ask-upload-bg, #fafafa);
      color: var(--ask-upload-text, #a3a3a3);
      font-size: 0.8125rem;
      cursor: pointer;
      transition: border-color 0.15s, background 0.15s;
      text-align: center;
    }
    .dropzone:hover {
      border-color: var(--ask-upload-hover-border, #a3a3a3);
      background: var(--ask-upload-hover-bg, #f5f5f5);
    }
    .dropzone:has(input:focus-visible) {
      border-color: var(--ask-upload-hover-border, #a3a3a3);
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
      gap: 0.5rem;
      margin-top: 0.5rem;
    }

    /* Dark mode */
    @media (prefers-color-scheme: dark) {
      :host {
        --ask-upload-border: var(--ask-upload-border-dark, #262626);
        --ask-upload-bg: var(--ask-upload-bg-dark, #1a1a1a);
        --ask-upload-text: var(--ask-upload-text-dark, #525252);
        --ask-upload-hover-border: var(--ask-upload-hover-border-dark, #404040);
        --ask-upload-hover-bg: var(--ask-upload-hover-bg-dark, #141414);
      }
    }
    :host-context(.dark) {
      --ask-upload-border: var(--ask-upload-border-dark, #262626);
      --ask-upload-bg: var(--ask-upload-bg-dark, #1a1a1a);
      --ask-upload-text: var(--ask-upload-text-dark, #525252);
      --ask-upload-hover-border: var(--ask-upload-hover-border-dark, #404040);
      --ask-upload-hover-bg: var(--ask-upload-hover-bg-dark, #141414);
    }
    :host-context(.light) {
      --ask-upload-border: var(--ask-upload-border-light, #d4d4d4);
      --ask-upload-bg: var(--ask-upload-bg-light, #fafafa);
      --ask-upload-text: var(--ask-upload-text-light, #a3a3a3);
      --ask-upload-hover-border: var(--ask-upload-hover-border-light, #a3a3a3);
      --ask-upload-hover-bg: var(--ask-upload-hover-bg-light, #f5f5f5);
    }
  `;

  @property({ type: String }) accept = "";
  @property({ type: Boolean }) multiple = true;
  @property({ type: Boolean }) disabled = false;
  @property({ type: String }) files = ""; // JSON string of FileEntry[]

  @query(".dropzone-input", true) private _input!: HTMLInputElement;

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
      <div class="dropzone ${this.disabled ? "dropzone--disabled" : ""}" @click=${this._handleClick}>
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
