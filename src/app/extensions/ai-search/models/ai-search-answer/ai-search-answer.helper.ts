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

function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, character => ESCAPED_CHARACTERS[character]);
}

/**
 * Renders the inline Markdown of an escaped text: bold and italic become elements, the targets of links and images are
 * dropped so that only their text remains, and inline code loses its backticks.
 */
function renderInline(text: string): string {
  return (
    text
      .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
      // UC-001 BR-008: Links of the AI answer are not shown (product links: OQ-026).
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/\*\*(?=\S)(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(?=\S)(.+?)__/g, '<strong>$1</strong>')
      .replace(/\*(?=\S)(.+?)\*/g, '<em>$1</em>')
      .replace(/(^|[^\w])_(?=\S)(.+?)_(?=[^\w]|$)/g, '$1<em>$2</em>')
  );
}

export class AiSearchAnswerHelper {
  // UC-001 BR-001: A search query of at least 2 words and 8 characters requests an AI answer.
  static isAnswerRequested(searchQuery: string): boolean {
    const normalized = searchQuery?.trim().replace(/\s+/g, ' ') ?? '';
    return normalized.split(' ').length >= 2 && normalized.length >= 8;
  }

  static isAnswered(answer: AiSearchAnswer): boolean {
    return !!answer?.searchQuery && !!answer.text?.trim();
  }

  /**
   * Converts the Markdown of an AI answer to HTML with paragraphs, lists, bold, and italic text only.
   * Every other element of the AI answer is shown as text without its Markdown marks.
   *
   * @param markdown  The Markdown text of the AI answer.
   * @returns         The HTML of the AI answer.
   */
  // UC-001 BR-008: Bold, italic, paragraphs, and lists only; HTML and scripts are dropped.
  static toHtml(markdown: string): string {
    const text = (markdown ?? '')
      .replace(/\r\n?/g, '\n')
      .replace(ELEMENTS_WITH_CONTENT, '')
      .replace(HTML_COMMENTS, '')
      .replace(HTML_TAGS, '');

    const blocks: string[] = [];
    let paragraph: string[] = [];
    let list: { tag: 'ol' | 'ul'; items: string[] };

    const closeParagraph = () => {
      if (paragraph.length) {
        blocks.push(`<p>${renderInline(escapeHtml(paragraph.join(' ')))}</p>`);
        paragraph = [];
      }
    };
    const closeList = () => {
      if (list) {
        blocks.push(
          `<${list.tag}>${list.items.map(item => `<li>${renderInline(escapeHtml(item))}</li>`).join('')}</${list.tag}>`
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
