import { escape, escapeRegExp, uniq } from 'lodash-es';

import { ErrorFeedback, HttpError } from './http-error.model';

export class HttpErrorHelper {
  /**
   * Formats all messages of an HTTP error for display: the main messages and their causes are rendered as separate lines.
   * ICM messages are trusted and may contain HTML, but the values of their parameters (e.g. a SKU entered by the user) are HTML-escaped.
   *
   * The result has to be rendered as sanitized HTML, e.g. in a toast or with the DomSanitizer.
   */
  static formatMessage(error: Partial<HttpError>): string {
    const lines = error?.errors?.flatMap(feedback => HttpErrorHelper.getLines(feedback)) ?? [];
    return lines.length ? HttpErrorHelper.joinLines(lines) : error?.message;
  }

  /**
   * Formats the message of a single error feedback and its causes, see {@link formatMessage}.
   */
  static formatFeedback(feedback: ErrorFeedback): string {
    return HttpErrorHelper.joinLines(HttpErrorHelper.getLines(feedback));
  }

  private static getLines(feedback: ErrorFeedback): string[] {
    return [
      HttpErrorHelper.escapeParameters(feedback?.message, feedback?.parameters),
      ...(feedback?.causes ?? []).map(cause =>
        HttpErrorHelper.escapeParameters(cause.message, { ...feedback.parameters, ...cause.parameters })
      ),
    ].filter(line => !!line);
  }

  private static joinLines(lines: string[]): string {
    return lines.length > 1 ? lines.map(line => `<div>${line}</div>`).join('') : lines[0];
  }

  private static escapeParameters(message: string, parameters: Record<string, unknown>): string {
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
