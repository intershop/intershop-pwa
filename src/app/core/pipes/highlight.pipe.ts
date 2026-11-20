import { Pipe, PipeTransform } from '@angular/core';

import { HtmlEncodePipe } from './html-encode.pipe';

/**
 * inserts highlighting markup into the text string
 * at the occurrences of the search string.
 *
 * Set `encode` for untrusted text (e.g. user input) to HTML encode the text
 * while keeping the highlighting markup.
 */
@Pipe({
  name: 'ishHighlight',
  standalone: true,
})
export class HighlightPipe implements PipeTransform {
  private htmlEncodePipe = new HtmlEncodePipe();

  transform(text: string, search: string, encode = false): string {
    const enc = (value: string) => (encode ? this.htmlEncodePipe.transform(value) : value);

    if (search && text) {
      let pattern = search.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&').toLowerCase();
      pattern = pattern
        .split(' ')
        .filter(t => t.length > 0)
        .join('|');
      const regex = new RegExp(pattern, 'gi');
      let result = '';
      let lastIndex = 0;
      for (const match of text.matchAll(regex)) {
        result += `${enc(text.slice(lastIndex, match.index))}<span class="searchTerm">${enc(match[0])}</span>`;
        lastIndex = match.index + match[0].length;
      }
      return result + enc(text.slice(lastIndex));
    } else {
      return text ? enc(text) : text;
    }
  }
}
