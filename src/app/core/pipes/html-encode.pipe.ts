import { Pipe, PipeTransform } from '@angular/core';

/**
 * The HTML encode pipe simply replaces HTML special characters like angle brackets (< and >) with HTML entities
 * so they can be displayed as plain text in a web page.
 * https://jasonwatmore.com/vanilla-js-html-encode-in-javascript
 */
@Pipe({ name: 'htmlEncode', pure: true })
export class HtmlEncodePipe implements PipeTransform {
  transform(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
}
