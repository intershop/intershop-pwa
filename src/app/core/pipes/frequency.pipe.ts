import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * The frequency pipe converts a string of special interval format to the corresponding display string
 * example: interval 'P21D' returns '3 Week(s)'
 */
@Pipe({ name: 'ishFrequency' })
export class FrequencyPipe implements PipeTransform {
  constructor(private translate: TranslateService) {}

  transform(interval: string): string {
    let period = interval.slice(-1).toUpperCase();
    let duration = parseInt(interval.slice(1, -1), 10);

    // convert days to weeks if possible since the API only returns daily, monthly or yearly intervals
    if (period === 'D' && duration % 7 === 0) {
      period = 'W';
      duration = duration / 7;
    }

    switch (period) {
      case 'D':
        return this.translate.instant('order.recurrence.period.days', { 0: duration });
      case 'W':
        return this.translate.instant('order.recurrence.period.weeks', { 0: duration });
      case 'M':
        return this.translate.instant('order.recurrence.period.months', { 0: duration });
      case 'Y':
        return this.translate.instant('order.recurrence.period.years', { 0: duration });
      default:
        return interval;
    }
  }
}
