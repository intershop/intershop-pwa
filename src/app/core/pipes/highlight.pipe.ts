import { Pipe, PipeTransform } from '@angular/core';

/**
 * inserts highlighting markup into the text string
 * at the occurences of the search string.
 */
@Pipe({ name: 'ishHighlight' })
export class HighlightPipe implements PipeTransform {
  transform(text: string, search: string): string {
    if (search && text) {
      let pattern = search.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&').toLowerCase();
      pattern = pattern
        .split(' ')
        .filter(t => t.length > 0)
        .join('|');
      const regex = new RegExp(pattern, 'gi');
      return text.replace(regex, match => `<span class="searchTerm">${match}</span>`);
    } else {
      return text;
    }
  }
}
