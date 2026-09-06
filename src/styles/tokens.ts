import { unsafeCSS } from "lit";

/**
 * Shared design tokens for the ask-ui-kit.
 *
 * Every ask-* component composes these tokens into its styles, so the whole
 * kit is themed by overriding the token values — one place, not per
 * component. Two override surfaces exist:
 *
 *   1. The semantic token itself:  --ask-text, --ask-surface, ...
 *   2. Its light/dark variants:    --ask-text-light, --ask-text-dark, ...
 *
 * Dark mode follows this precedence:
 *   1. `[theme="dark"]` on the component or any ancestor (explicit, wins)
 *   2. `.dark` class on any ancestor (legacy path)
 *   3. `prefers-color-scheme: dark` (OS setting) — unless `[theme="light"]`
 *   4. `[theme="light"]` pins light explicitly
 *
 * The shape tokens (--ask-radius, --ask-font, --ask-spacing, ...) are not
 * themed; override the `-app` variants to restyle the kit.
 */

interface Token {
  light: string;
  dark: string;
}

const TOKENS: Record<string, Token> = {
  /* Surfaces */
  "surface": { light: "#ffffff", dark: "#171717" },
  "surface-muted": { light: "#f5f5f5", dark: "#1a1a1a" },
  "surface-hover": { light: "#f5f5f5", dark: "#1a1a1a" },
  "surface-active": { light: "#e5e5e5", dark: "#262626" },
  /* Text */
  "text": { light: "#171717", dark: "#e5e5e5" },
  "text-muted": { light: "#a3a3a3", dark: "#737373" },
  "text-faint": { light: "#737373", dark: "#525252" },
  "text-inverse": { light: "#fafafa", dark: "#171717" },
  /* Lines & focus */
  "border": { light: "#e5e5e5", dark: "#262626" },
  "border-strong": { light: "#d4d4d4", dark: "#404040" },
  "focus": { light: "#a3a3a3", dark: "#525252" },
  /* Accent */
  "accent": { light: "#c2410c", dark: "#ea580c" },
  "accent-text": { light: "#fafafa", dark: "#fafafa" },
  /* Danger (errors, destructive) */
  "danger": { light: "#dc2626", dark: "#f87171" },
  "danger-text": { light: "#991b1b", dark: "#fca5a5" },
  "danger-bg": { light: "#fef2f2", dark: "#450a0a" },
  "danger-border": { light: "#fecaca", dark: "#7f1d1d" },
  /* Success */
  "success": { light: "#16a34a", dark: "#4ade80" },
  "success-text": { light: "#166534", dark: "#86efac" },
  "success-bg": { light: "#f0fdf4", dark: "#052e16" },
  "success-border": { light: "#bbf7d0", dark: "#166534" },
};

const SHAPE = `
  --ask-radius: var(--ask-radius-app, 0.5rem);
  --ask-radius-small: var(--ask-radius-app-small, 0.375rem);
  --ask-radius-pill: var(--ask-radius-app-pill, 9999px);
  --ask-font: var(--ask-font-app, inherit);
  --ask-font-size: var(--ask-font-size-app, 0.8125rem);
  --ask-font-size-small: var(--ask-font-size-app-small, 0.6875rem);
  --ask-spacing: var(--ask-spacing-app, 0.5rem);
`;

function varLines(prefix: "light" | "dark"): string {
  return Object.entries(TOKENS)
    .map(([name, token]) => `  --ask-${name}: var(--ask-${name}-${prefix}, ${token[prefix]});`)
    .join("\n");
}

export const tokens = unsafeCSS(`
:host {
${varLines("light")}
${SHAPE}
}

/* Explicit dark theme (on the component or any ancestor) */
:host([theme="dark"]),
:host-context([theme="dark"]),
/* Legacy .dark class path */
:host-context(.dark) {
${varLines("dark")}
}

/* OS preference. MUST come before the light pin below: the two blocks have
   equal specificity, so source order decides, and an explicit [theme="light"]
   pin has to beat a dark-OS machine. (This ordering was inverted once and
   the pin silently lost — pinned-light components rendered dark.) */
@media (prefers-color-scheme: dark) {
  :host(:not([theme="light"])) {
${varLines("dark")}
  }
}

/* Explicit light theme pins light — last, so it wins over the OS block */
:host([theme="light"]),
:host-context([theme="light"]) {
${varLines("light")}
}
`);
