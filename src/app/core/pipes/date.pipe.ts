import { formatDate } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Pipe({ name: 'ishDate', pure: true })
export class DatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(value: string | number | Date, format = 'mediumDate', timezone?: string): string {
    if (!value || !this.translateService.currentLang) {
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
    return formatDate(date, format, this.translateService.currentLang, timezone || '+0000');
  }
}
