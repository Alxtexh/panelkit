# Textarea, markdown, rich text, code

Four fields cover "more than a line of text," each storing something
different — picking the wrong one means picking the wrong storage shape
later.

| Field | Stores | Use it when |
|---|---|---|
| [`TextareaField`](/api/classes/textarea-field) | Plain text, no formatting | A note, a description, free-form text nobody will render as markup |
| [`MarkdownField`](/api/classes/markdown-field) | Raw Markdown **source** | You want the stored value to stay diffable in an audit log, readable in a database client, and renderable to email, PDF, or plain text later — it is never rendered server-side |
| [`RichEditorField`](/api/classes/rich-editor-field) | Sanitised HTML | The stored value **is** the rendering — what you save is what gets displayed |
| [`CodeField`](/api/classes/code-field) | Config or code snippets | Monospace, Tab indents, line numbers; `->language('json')` adds a server-side `json` validation rule on top of the language hint |

## `RichEditorField` sanitizes on every save, unconditionally

Whatever the client sends is run through a strict allowlist sanitizer before
storage — a small set of formatting tags survive (`p`, `strong`, `em`, `h2`,
`h3`, lists, `blockquote`, `code`, `pre`, and a scheme-checked `a[href]`);
`script`, `style`, `iframe`, `object`, `embed`, `svg`, and `form` are removed
with their contents, and every link is forced to open safely
(`target="_blank" rel="noopener noreferrer nofollow"`). This runs
server-side every time, regardless of what a compromised or buggy client
might send — never rely on the editor's own client-side behavior as the
security boundary.

## `MarkdownField` never renders, and never strips

Because the stored value is the *source*, not a rendering, `MarkdownField`
doesn't strip anything — a fenced code block containing HTML-looking text
survives exactly as typed. Render it (to HTML, to PDF, to plain text) at the
point of use, with whatever sanitization that specific output format needs.

## `BuilderField` and `RepeaterField` for structured content

Neither of these is a text field, but they're the next reach when a form
needs more structure than any of the four above — see [Form schema](/forms/#every-field-type).
