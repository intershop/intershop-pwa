<!--
kb_guide
kb_pwa
kb_everyone
kb_sync_latest_only
-->

# Markdown Mirrors

- [Accessing a Mirror](#accessing-a-mirror)
- [What Is Included](#what-is-included)
- [Implementation](#implementation)

The SSR server provides a Markdown "mirror" of every rendered page under the same URL with an added `.md` suffix (for example, `/en/home` → `/en/home.md`).
These mirrors are intended for machine consumers, such as search crawlers and large language models (LLMs).

## Accessing a Mirror

Append `.md` to any page path.
The mirror renders the same page and returns its main content converted to Markdown with `Content-Type: text/markdown; charset=UTF-8`.
Each HTML page also advertises its mirror through a `Link: </en/home.md>; rel="alternate"; type="text/markdown"` response header.

## What Is Included

Only the main content of the page (`<main id="main-content">`) is converted.
Page chrome such as header, footer, navigation, scripts, forms, and other interactive, non-content, or screen-reader-only UI elements is stripped.
The specific conversion rules and PWA-specific tweaks are described in _src/ssr/html-to-markdown.ts_.

## Implementation

The conversion is implemented using [Turndown](https://github.com/mixmark-io/turndown) and runs in plain Node.js without a browser DOM.
The `.md` route is registered in _server.ts_.
No configuration is required; mirrors are available whenever SSR is running.
Mirrors follow the same caching behavior as regular pages.
