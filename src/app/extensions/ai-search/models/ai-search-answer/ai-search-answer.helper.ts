import { LinkParser } from 'ish-core/utils/link-parser';

import { AiSearchAnswer } from './ai-search-answer.model';

const ESCAPED_CHARACTERS: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

const ELEMENTS_WITH_CONTENT =
  /<(script|style|iframe|object|embed|template|noscript|textarea|svg|math)\b[\s\S]*?(<\/\1\s*>|$)/gi;

const HTML_COMMENTS = /<!--[\s\S]*?(-->|$)/g;

const HTML_TAGS = /<\/?[a-z!?][^>]*>/gi;

const UNORDERED_LIST_ITEM = /^\s*[-*+]\s+(.*)$/;

const ORDERED_LIST_ITEM = /^\s*\d+[.)]\s+(.*)$/;

const HEADING = /^\s*#{1,6}\s+(.*)$/;

const BLOCKQUOTE = /^\s*>\s?(.*)$/;

const HORIZONTAL_RULE = /^\s*([-*_])(\s*\1){2,}\s*$/;

const LINK = /\[([^\]]+)\]\(([^)]*)\)/g;

const PRODUCT_LINK_TARGET = /^\s*product:\/\/([^@\s]+)(@\S*)?\s*$/;

const LINK_PLACEHOLDER = /\uE000(\d+)\uE000/g;

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, character => ESCAPED_CHARACTERS[character]);
}

const UNESCAPED_CHARACTERS: Record<string, string> = Object.fromEntries(
  Object.entries(ESCAPED_CHARACTERS).map(([character, entity]) => [entity, character])
);

function unescapeHtml(text: string): string {
  return text.replace(/&(amp|lt|gt|quot|#39);/g, entity => UNESCAPED_CHARACTERS[entity]);
}

/**
 * Renders bold and italic text of an escaped text as elements, and removes the backticks of inline code.
 */
function renderEmphasis(text: string): string {
  return text
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*(?=\S)(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(?=\S)(.+?)__/g, '<strong>$1</strong>')
    .replace(/\*(?=\S)(.+?)\*/g, '<em>$1</em>')
    .replace(/(^|[^\w])_(?=\S)(.+?)_(?=[^\w]|$)/g, '$1<em>$2</em>');
}

/**
 * Renders the inline Markdown of an escaped text: bold and italic become elements, a named product becomes a link to
 * its product detail page, the targets of other links and of images are dropped so that only their text remains, and
 * inline code loses its backticks.
 */
function renderInline(text: string, baseHref: string): string {
  const productLinks: string[] = [];
  const withoutLinks = text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
    // UC-001 BR-008: Only named products (product://<SKU>) link to their product detail page.
    .replace(LINK, (_, label: string, target: string) => {
      const sku = PRODUCT_LINK_TARGET.exec(target)?.[1];
      if (!sku) {
        return label;
      }
      const href = LinkParser.parseLink(`product://${encodeURIComponent(unescapeHtml(sku))}`, baseHref);
      productLinks.push(`<a href="${escapeHtml(href)}">${renderEmphasis(label)}</a>`);
      return `\uE000${productLinks.length - 1}\uE000`;
    });

  return renderEmphasis(withoutLinks).replace(LINK_PLACEHOLDER, (_, index: string) => productLinks[Number(index)]);
}

export class AiSearchAnswerHelper {
  // UC-001 BR-001: A search query of at least 2 words and 8 to 500 characters requests an AI answer.
  static isAnswerRequested(searchQuery: string): boolean {
    const normalized = searchQuery?.trim().replace(/\s+/g, ' ') ?? '';
    return normalized.split(' ').length >= 2 && normalized.length >= 8 && normalized.length <= 500;
  }

  static isAnswered(answer: AiSearchAnswer): boolean {
    return !!answer?.searchQuery && !!answer.text?.trim();
  }

  /**
   * Converts the Markdown of an AI answer to HTML with paragraphs, lists, bold and italic text, and links of the
   * named products to their product detail pages.
   * Every other element of the AI answer is shown as text without its Markdown marks.
   *
   * @param markdown  The Markdown text of the AI answer.
   * @param baseHref  The base href of the storefront, prefixed to the links of the named products.
   * @returns         The HTML of the AI answer.
   */
  // UC-001 BR-008: Formatting and named product links only; HTML, scripts, and other links are dropped.
  static toHtml(markdown: string, baseHref?: string): string {
    const text = (markdown ?? '')
      .replace(/\r\n?/g, '\n')
      .replace(/\uE000/g, '')
      .replace(ELEMENTS_WITH_CONTENT, '')
      .replace(HTML_COMMENTS, '')
      .replace(HTML_TAGS, '');

    const blocks: string[] = [];
    let paragraph: string[] = [];
    let list: { tag: 'ol' | 'ul'; items: string[] };

    const closeParagraph = () => {
      if (paragraph.length) {
        blocks.push(`<p>${renderInline(escapeHtml(paragraph.join(' ')), baseHref)}</p>`);
        paragraph = [];
      }
    };
    const closeList = () => {
      if (list) {
        blocks.push(
          `<${list.tag}>${list.items
            .map(item => `<li>${renderInline(escapeHtml(item), baseHref)}</li>`)
            .join('')}</${list.tag}>`
        );
        list = undefined;
      }
    };
    const addListItem = (tag: 'ol' | 'ul', item: string) => {
      closeParagraph();
      if (list?.tag !== tag) {
        closeList();
        list = { tag, items: [] };
      }
      list.items.push(item);
    };

    for (const rawLine of text.split('\n')) {
      const line = BLOCKQUOTE.exec(rawLine)?.[1] ?? rawLine;

      if (!line.trim() || HORIZONTAL_RULE.test(line)) {
        closeParagraph();
        closeList();
      } else if (UNORDERED_LIST_ITEM.test(line)) {
        addListItem('ul', UNORDERED_LIST_ITEM.exec(line)[1]);
      } else if (ORDERED_LIST_ITEM.test(line)) {
        addListItem('ol', ORDERED_LIST_ITEM.exec(line)[1]);
      } else if (HEADING.test(line)) {
        closeParagraph();
        closeList();
        paragraph.push(HEADING.exec(line)[1]);
        closeParagraph();
      } else {
        closeList();
        paragraph.push(line.trim());
      }
    }
    closeParagraph();
    closeList();

    return blocks.join('');
  }
}
