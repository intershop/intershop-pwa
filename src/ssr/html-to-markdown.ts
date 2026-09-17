/**
 * Converts a server-rendered PWA page into a Markdown "mirror" of its main content.
 *
 * The SSR Express server serves a Markdown version of every page under the same URL
 * with a `.md` suffix (see the Markdown mirror route in `server.ts`). These mirrors are
 * meant for machine consumers such as crawlers and LLMs: they contain the page-specific
 * content without the surrounding chrome, scripts, forms and other interactive UI.
 *
 * The conversion isolates `<main id="main-content">`, strips non-content elements,
 * rewrites internal links to their `.md` mirror, and applies PWA-specific tweaks.
 * It runs in plain Node.js via Turndown + domino (no browser DOM required).
 */

import { createDocument } from '@mixmark-io/domino';
import TurndownService from 'turndown';

/**
 * Element tag names that never carry meaningful content for an LLM-oriented Markdown
 * mirror. They are removed together with their children before conversion.
 */
const REMOVED_TAGS = new Set([
  'BUTTON',
  'FORM',
  'IFRAME',
  'INPUT',
  'ISH-CATEGORY-NAVIGATION',
  'ISH-FILTER-NAVIGATION',
  'LABEL',
  'NOSCRIPT',
  'OPTION',
  'SCRIPT',
  'SELECT',
  'STYLE',
  'SVG',
  'TEMPLATE',
  'TEXTAREA',
]);

const ELEMENT_NODE = 1;

interface ElementLike {
  getAttribute(name: string): null | string;
  hasAttribute(name: string): boolean;
}

/**
 * Determine whether an element is decorative / non-indexable UI that should not
 * appear in the Markdown mirror.
 */
function isNonContentElement(element: ElementLike): boolean {
  return (
    element.getAttribute('aria-hidden') === 'true' ||
    element.getAttribute('role') === 'tablist' ||
    element.hasAttribute('data-nosnippet') ||
    element.hasAttribute('hidden') ||
    /\b(?:skip[-\w]*|visually-hidden|sr-only)\b/i.test(element.getAttribute('class') ?? '')
  );
}

/**
 * Rewrite an internal PWA app route so it points to its Markdown mirror (`…/route.md`),
 * allowing consumers to traverse the site entirely in Markdown. External links,
 * ICM/static/asset paths and already-mirrored links are left unchanged. Any query
 * string or fragment is preserved after the inserted `.md` suffix.
 */
function toMarkdownMirrorHref(href: string): string {
  if (!href.startsWith('/') || href.startsWith('//') || /^\/(INTERSHOP|assets)\b/i.test(href)) {
    return href;
  }
  const [, path, suffix = ''] = /^([^?#]*)([?#].*)?$/.exec(href) ?? [];
  if (!path || path.endsWith('.md')) {
    return href;
  }
  return `${path}.md${suffix}`;
}

const turndownService = new TurndownService({
  headingStyle: 'atx',
  hr: '---',
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  emDelimiter: '_',
});

/**
 * Remove non-content elements by tag name or by attributes that mark them as
 * decorative / non-indexable UI.
 */
turndownService.remove((node: Node) => {
  // uppercase because foreign elements (e.g. SVG) keep their lowercase nodeName
  if (REMOVED_TAGS.has(node.nodeName.toUpperCase())) {
    return true;
  }
  if (node.nodeType !== ELEMENT_NODE) {
    return false;
  }
  return isNonContentElement(node as unknown as ElementLike);
});

/**
 * Remove images entirely: their `alt` text carries no content worth keeping in the
 * Markdown mirror. This must be an added rule (not a `remove` filter) because the
 * built-in CommonMark image rule takes precedence over `remove` filters. An image
 * wrapped in a link becomes an empty anchor, which `cleanAnchors` then drops, leaving
 * only the adjacent text link.
 */
turndownService.addRule('removeImages', {
  filter: 'img',
  replacement: () => '',
});

/**
 * Clean up anchors: drop non-content anchors and icon-only links as well as links
 * that point to scripts, mail templates or in-page fragments, while keeping their
 * text content where present.
 */
turndownService.addRule('cleanAnchors', {
  filter: 'a',
  replacement: (content, node) => {
    const element = node as unknown as ElementLike;
    if (isNonContentElement(element)) {
      return '';
    }
    const href = (element.getAttribute('href') ?? '').trim();
    const text = content.trim();
    if (!href || /^(javascript:|mailto:|#)/i.test(href)) {
      return text;
    }
    return text ? `[${text}](${toMarkdownMirrorHref(href)})` : '';
  },
});

/**
 * Render the breadcrumb as a single `A > B > C` trail (instead of an ordered list). It
 * gives the LLM the page's place in the hierarchy in a compact, navigable form;
 * ancestor links are rewritten to their `.md` mirror, the current page stays plain text.
 */
turndownService.addRule('breadcrumb', {
  filter: node => node.nodeName === 'ISH-BREADCRUMB',
  replacement: (_content, node) => {
    const element = node as unknown as Element;
    const trail = Array.from(element.querySelectorAll('li')).map(li => {
      const href = li.querySelector('a')?.getAttribute('href');
      const text = (li.textContent ?? '').trim();
      return href ? `[${text}](${toMarkdownMirrorHref(href)})` : text;
    });
    return trail.length ? `\n\n${trail.join(' > ')}\n\n` : '';
  },
});

/**
 * Replace the star-rating widget with an explicit numeric rating so it reads as
 * `Rating: 2/5` instead of a cryptic run of star glyphs. The leading space keeps it
 * from gluing onto a preceding product link on listing tiles.
 */
// cspell:ignore valuenow valuemax
turndownService.addRule('productRating', {
  filter: node => node.nodeName === 'NGB-RATING',
  replacement: (_content, node) => {
    const element = node as unknown as ElementLike;
    const now = element.getAttribute('aria-valuenow');
    const max = element.getAttribute('aria-valuemax') ?? '5';
    return now ? ` Rating: ${now}/${max}` : '';
  },
});

/**
 * Separate label/value span pairs that render with no gap (e.g. product variations),
 * turning `Hard drive size256GB` into `Hard drive size: 256GB`.
 */
turndownService.addRule('labelSeparator', {
  filter: node =>
    node.nodeName === 'SPAN' && /\bspan-separator\b/.test((node as unknown as ElementLike).getAttribute('class') ?? ''),
  replacement: content => {
    const text = content.trim();
    return text ? `${text}: ` : '';
  },
});

/**
 * Render a definition list (e.g. the product `Details` attributes) as compact
 * `- Term: Definition` bullets instead of Turndown's default term/definition blocks
 * separated by blank lines.
 */
turndownService.addRule('descriptionList', {
  filter: 'dl',
  replacement: (_content, node) => {
    const element = node as unknown as Element;
    const rows = Array.from(element.querySelectorAll('dt')).map(dt => {
      const label = (dt.textContent ?? '').trim().replace(/:\s*$/, '');
      const dd = dt.nextElementSibling;
      const value = dd?.tagName.toLowerCase() === 'dd' ? (dd.textContent ?? '').trim() : '';
      return value ? `- ${label}: ${value}` : `- ${label}`;
    });
    return rows.length ? `\n\n${rows.join('\n')}\n\n` : '';
  },
});

/**
 * Prefix each tab panel with its tab label as a level-2 heading, pairing panel and tab
 * via the `aria-labelledby` -> tab `id` relationship (the tab strip itself is stripped).
 * Requires the panels to be server-rendered (see `[destroyOnHide]="false"` on the tabs).
 */
// cspell:ignore labelledby
turndownService.addRule('tabPanelHeading', {
  filter: node => node.nodeName === 'DIV' && (node as unknown as ElementLike).getAttribute('role') === 'tabpanel',
  replacement: (content, node) => {
    const body = content.trim();
    if (!body) {
      return '';
    }
    const element = node as unknown as Element;
    const labelId = element.getAttribute('aria-labelledby');
    const tab = labelId ? element.ownerDocument?.getElementById(labelId) : undefined;
    const label = (tab?.textContent ?? '').trim();
    return label ? `\n\n## ${label}\n\n${body}\n\n` : `\n\n${body}\n\n`;
  },
});

/**
 * Relax Markdown escaping. The mirror is only ever read by an LLM and never
 * re-compiled to HTML, so Turndown's aggressive inline escaping (`\_`, `\*`,
 * `` \` ``, `\[`, `\.`, ...) is pure noise. Only escape line-start `#`/`>` so CMS text
 * is not turned into a spurious heading or block quote; list-like markers (`- `, `1. `)
 * are left as-is because rendering them as a list is harmless and `\-` noise is worse.
 */
turndownService.escape = (text: string): string => text.replace(/^(\s*)([#>])/gm, '$1\\$2');

/**
 * Extract the inner HTML of the PWA main content area (`<main id="main-content">`).
 * The surrounding page chrome (header, footer, banners) is discarded so that only
 * the page-specific content is converted to Markdown.
 *
 * Falls back to the document body when the main content element is not found.
 */
function extractMainContent(document: Document): string {
  const container = document.getElementById('main-content') ?? document.body;
  return container?.innerHTML ?? '';
}

/**
 * Derive a level-1 heading from the document `<title>`, dropping the ` | <site name>`
 * suffix. Used as a fallback for pages (e.g. login, register) whose main content is
 * lazy-loaded or form-only and therefore converts to nothing.
 */
function titleHeading(document: Document): string {
  const title = (document.title ?? '').split('|')[0].trim();
  return title ? `# ${title}` : '';
}

/**
 * Detect list items that carry no real content: empty markers, or pagination arrow
 * glyphs (`«` `»` `‹` `›`) whether bare or wrapped in a link.
 */
function isNoiseListItem(line: string): boolean {
  const trimmed = line.trim();
  if (/^[-*+]$/.test(trimmed)) {
    return true;
  }
  const item = trimmed.replace(/^[-*+]\s+/, '');
  if (item === trimmed) {
    return false;
  }
  const text = item.replace(/^\[(.*)\]\([^)]*\)$/, '$1').trim();
  return /^[«»‹›]+$/.test(text);
}

/**
 * Post-process the generated Markdown: normalize non-breaking spaces, drop empty list
 * markers left after stripping non-content children, unwrap headings that ended up
 * inside link text, space the rating off whatever directly follows it (review count or
 * review title glued on via a CSS-only gap), and collapse excessive blank lines.
 */
function cleanupMarkdown(markdown: string): string {
  return markdown
    .split('\n')
    .map(line => line.replace(/\u00a0/g, ' ').replace(/\s+$/, ''))
    .filter(line => !isNoiseListItem(line))
    .join('\n')
    .replace(/\[#{1,6}\s+/g, '[')
    .replace(/(Rating: [\d.]+\/\d+)(?=\S)/g, '$1 ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/**
 * Convert a fully rendered PWA page (HTML string) into a Markdown mirror.
 * Only the main content area is converted; page chrome and non-content
 * elements are stripped. Pages that convert to nothing fall back to a
 * heading derived from the page title.
 */
export function htmlToMarkdown(html: string): string {
  const document = createDocument(html, true);
  const markdown = cleanupMarkdown(turndownService.turndown(extractMainContent(document)));
  return markdown || titleHeading(document);
}
