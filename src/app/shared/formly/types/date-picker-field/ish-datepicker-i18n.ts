import { Injectable, ɵfindLocaleData } from '@angular/core';
import { NgbDateStruct, NgbDatepickerI18n } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { format } from 'date-fns';

@Injectable()
export class IshDatepickerI18n extends NgbDatepickerI18n {
  private locale: string;
  private localeData: string[][];

  constructor(translateService: TranslateService) {
    super();
    this.locale = translateService.currentLang;
    this.localeData = ɵfindLocaleData(this.locale);
  }

  getWeekdayLabel(weekday: number): string {
    return this.localeData[3][3][weekday % 7];
  }
  getMonthShortName(month: number): string {
    return this.localeData[5][1][month - 1];
  }
  getMonthFullName(month: number): string {
    return this.localeData[5][2][month - 1];
  }
  getDayAriaLabel(date: NgbDateStruct): string {
    const d = new Date();
    d.setFullYear(date.year);
    d.setMonth(date.month - 1);
    d.setDate(date.day);
    return format(d, this.localeData[10][0]);
  }
}
