# ask-ui-kit

Framework-agnostic Web Components for AI chat interfaces, built with [Lit](https://lit.dev). Not a Ruby gem: install it as an npm package.

## Installation

```bash
npm install ask-ui-kit
```

## Quick Start

### In any HTML page

```html
<script type="module">
  import "ask-ui-kit";
</script>

<ask-message role="user" content="What files do you have?"></ask-message>
<ask-message role="assistant" content="I have three invoices from Q3."></ask-message>
```

### In a Rails app with importmap

```ruby
# config/importmap.rb
pin "ask-ui-kit", to: "https://unpkg.com/ask-ui-kit@0.3.0/dist/index.js"
```

```erb
<%= javascript_import_module_tag "ask-ui-kit" %>

<ask-message role="user" content="<%= escape_javascript(message.content) %>"></ask-message>
```

### In a Svelte app

```svelte
<script>
  import "ask-ui-kit";
</script>

<ask-message role={msg.role} content={msg.content} />
```

### In a React app

```jsx
import "ask-ui-kit";

function ChatMessage({ role, content }) {
  return <ask-message role={role} content={content} />;
}
```

## Components

16 Web Components:

`ask-message`, `ask-thinking`, `ask-tool-call`, `ask-streaming`, `ask-code-block`, `ask-chat-input`, `ask-avatar`, `ask-attachment`, `ask-error`, `ask-suggestions`, `ask-model-selector`, `ask-markdown`, `ask-file-upload`, `ask-conversation-list`, `ask-voice-input`, `ask-scroll-bottom`

Components respect dark mode automatically via `prefers-color-scheme` and a `.dark`/`.light` class on the host, and are themeable with CSS custom properties. See the docs site for per-component attributes, events, and theming.

## Full documentation

The full ask-rb documentation lives at https://ask-rb.github.io/ask-docs. The [UI Kit guide](https://ask-rb.github.io/ask-docs/core/ui-kit) documents every component in detail. API reference: https://ask-rb.github.io/ask-docs/reference/api.

## Development

```bash
npm install
npm run dev     # dev server
npm run build   # build for production
npm run test    # run tests
```

## License

MIT
