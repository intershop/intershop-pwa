import { escape, escapeRegExp, uniq } from 'lodash-es';

export class HttpErrorHelper {
  /**
   * HTML-escapes the values of the parameters (e.g. a SKU entered by the user) in a trusted ICM message that may contain HTML.
   */
  static escapeParameters(message: string, parameters: Record<string, unknown>): string {
    const values = uniq(Object.values(parameters ?? {}))
      .filter((value): value is string => typeof value === 'string' && !!value)
      // match longer values first, so that values contained in other values are escaped completely
      .sort((a, b) => b.length - a.length);

    if (!message || !values.length) {
      return message;
    }
    // escape all values in one pass with a callback, so replacement tokens like '$&' in values are not interpreted and nothing is escaped twice
    const pattern = new RegExp(values.map(value => escapeRegExp(value)).join('|'), 'g');
    return message.replace(pattern, match => escape(match));
  }
}
