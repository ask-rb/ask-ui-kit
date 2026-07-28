# ask-ui-kit

Framework-agnostic Web Components for AI chat interfaces — built with [Lit](https://lit.dev).

## Installation

```bash
npm install @ask-rb/ask-ui-kit
```

## Usage

### In any HTML page

```html
<script type="module">
  import "@ask-rb/ask-ui-kit";
</script>

<ask-message role="user" content="What files do you have?"></ask-message>
<ask-message role="assistant" content="I have three invoices from Q3."></ask-message>
```

### In a Rails app with importmap

```bash
bin/importmap pin @ask-rb/ask-ui-kit
```

Or if JSPM doesn't support scoped packages:

```ruby
# config/importmap.rb
pin "@ask-rb/ask-ui-kit", to: "https://unpkg.com/@ask-rb/ask-ui-kit@0.1.0/dist/index.js"
```

```erb
<%= javascript_import_module_tag "@ask-rb/ask-ui-kit" %>

<ask-message role="user" content="<%= escape_javascript(message.content) %>"></ask-message>
```

### In a Svelte app

```svelte
<script>
  import "@ask-rb/ask-ui-kit";
</script>

<ask-message role={msg.role} content={msg.content} />
```

### In a React app

```jsx
import "@ask-rb/ask-ui-kit";

function ChatMessage({ role, content }) {
  return <ask-message role={role} content={content} />;
}
```

## Components

### `<ask-message>`

A chat bubble for user or assistant messages.

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `role` | `"user" \| "assistant"` | `"user"` | Message role — determines alignment and styling |
| `content` | `string` | `""` | Message text content |

#### Theming via CSS custom properties

```css
ask-message {
  --ask-user-bg: #f5f5f5;
  --ask-user-text: #171717;
  --ask-user-bg-dark: #262626;
  --ask-user-text-dark: #f5f5f5;
  --ask-assistant-text: #171717;
  --ask-assistant-text-dark: #f5f5f5;
}
```

#### Dark mode

The component automatically respects:
1. **System preference** — `@media (prefers-color-scheme: dark)`
2. **Host `.dark` class** — `:host-context(.dark)` for manual toggle
3. **Host `.light` class** — overrides system preference

No configuration needed — works out of the box with Tailwind's dark mode, Rails themes, or any `.dark`/`.light` class on `<html>`.

## Development

```bash
npm install
npm run dev     # dev server
npm run build   # build for production
npm run test    # run tests
```

## License

MIT
