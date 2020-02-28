import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export function formatISHDate(
  value: string | number | Date,
  format = 'mediumDate',
  lang: string,
  timezone?: string
): string {
  if (!value || !lang) {
    return 'undefined';
  }
  let date: Date;
  if (typeof value === 'number') {
    date = new Date(value);
  } else if (typeof value === 'string') {
    date = new Date(Date.parse(value));
  } else {
    date = value;
  }
  return formatDate(date, format, lang, timezone || '+0000');
}

/**
 * The date pipe converts a number, string or date into a localized date format
 * example values:
 * as number: 1581690101334
 * as string: '01 Jan 1970 00:00:00 GMT'
 * other parameters see also angular date pipe
 */
@Pipe({ name: 'ishDate', pure: true })
export class DatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(value: string | number | Date, format = 'mediumDate', timezone?: string): string {
    return formatISHDate(value, format, this.translateService.currentLang, timezone);
  }
}
