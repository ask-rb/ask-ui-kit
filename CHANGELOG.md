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
