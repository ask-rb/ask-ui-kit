# Changelog

## [0.4.1] — 2026-08-07

### Added

- **`<ask-device-auth>` component** — the RFC 8628 device-authorization dance as a themed web component. Props: `verification-uri`, `user-code`, `pending` (reflects the "not authorized yet" notice), `expires-label`. The completion click fires a bubbling `ask-authorize` event for the host app to poll the token endpoint. Extracted from the Anywaye providers page (xAI / GitHub Copilot connect flows).

## [0.4.0] — 2026-08-07

### Added

- **`<ask-sidebar>` component** — hierarchical conversation sidebar: collapsible groups, site nodes nesting their conversations, New-chat button, active state. Collapse/expand state persists across navigations via `sessionStorage` (`storageKey` attribute).
- **Shared design tokens** (`src/styles/tokens.ts`, exported from the kit) — one theming surface for all 17 components (`--ask-text`, `--ask-surface*`, `--ask-border`, `--ask-accent`, `--ask-danger*`, `--ask-success*`, shape tokens). Theming the kit is now a handful of CSS custom properties instead of per-component palettes.
- **`[theme]` attribute theming** — explicit `theme="dark|light"` on the component or any ancestor wins; OS `prefers-color-scheme` remains the fallback; the legacy `.dark`/`.light` class path still works.
- **Linting** — eslint + `eslint-plugin-lit` + `eslint-plugin-lit-a11y` (`npm run lint`); keyboard-support violations fail.
- **CI** — GitHub Actions: lint + typecheck + build + Playwright on push/PR; npm publish on `v*` tags.
- **Vendor script** (`script/vendor.mjs`) — builds the kit and syncs the bundle into consumer apps (`public/ask-ui-kit.js`) with the importmap `?v=` pin bumped.

### Changed

- All 17 components now compose the shared tokens (one dark-mode implementation in `tokens.ts` instead of per-component blocks). Bundle dropped ~20 kB (~94 kB raw / ~20 kB gzip).

### Fixed

- Keyboard accessibility on clickable elements (`ask-conversation-list` items, `ask-file-upload` dropzone) — `role="button"` + `tabindex` + Enter/Space.
- Real-scenario tests ran against a stale bundle and never executed module scripts (`page.setContent` does not run modules); they now load real fixture pages and assert actual behavior.

# Changelog

## [0.1.0] — 2026-07-28

### Added

- **`<ask-message>` component** — a framework-agnostic chat bubble for user or assistant messages.
  - `role` attribute (`"user"` / `"assistant"`) for alignment and styling
  - `content` attribute for message text
  - Light and dark mode support via system preference, `.dark` class, and `.light` class
  - CSS custom properties for full theme customization
  - Tailwind CSS utility classes for layout and spacing
  - Built with Lit for Shadow DOM encapsulation
  - Works in any framework: HTML, Rails, Svelte, React, Vue
