# Uploads

```php
FileUploadField::make('attachment')->maxKilobytes(5120),
FileUploadField::make('avatar')->image(),
```

Uploads are **two-phase**: the file itself goes to its own upload endpoint
first, and the form only ever carries a path/handle string — not the file
bytes. This is why `typeRules()` validates the handle as a string (`max:2048`
characters), not the file itself; file-shape validation (size, extension)
happens at the dedicated upload endpoint.

## Restricting file types

```php
FileUploadField::make('document')->accept(['pdf', 'docx']),
```

`accept()` can only **narrow** the allowed extensions against the package's
own known-extension list — it cannot widen it to accept something PanelKit
doesn't already recognize.

## Images specifically

```php
FileUploadField::make('photo')->image(),
```

`image()` defaults the accepted extensions to the package's image list,
which **deliberately excludes SVG** — an SVG file can contain executable
script, and accepting it as "just an image" is a real attack surface.

## Size limits

```php
FileUploadField::make('report')->maxKilobytes(10240),
```

Your declared limit is still capped by the package's own hard ceiling
regardless of what you configure — `maxKilobytes()` can only tighten the
limit, never loosen it past the platform default.

## Picking from a media library instead of uploading fresh

```php
FileUploadField::make('photo')->fromLibrary(),
```

## What's actually stored, and what the form shows back

`presentValue()` returns `{value, name, size}` for a file that still exists,
or `null` if it's since been deleted — a field showing `null` on an Edit page
means the underlying file is gone, not that nothing was ever uploaded.
`transformForStorage()` promotes a pending upload's temporary handle to its
permanent path only once the record itself is actually saved, so an upload
abandoned mid-form doesn't leave an orphaned permanent file — see
`panel:prune-uploads` in the [command reference](/commands/) for cleaning up
uploads that were never attached to a saved record at all.
