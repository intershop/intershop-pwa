import { Injectable, ɵfindLocaleData } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { format, parse } from 'date-fns';

/**
 * This service handles conversion between the NgbDateStruct used by NgbDatepicker and the string representation in the input field.
 *
 * Note that this is distinct from the internal date representation, wich is handled by `NgbDateNativeAdapter`.
 *
 * Currently, this uses Angular's internal locale api to retrieve date formats.
 *
 * In the future, this could be handled via a server configuration.
 */
@Injectable()
export class LocalizedParserFormatter extends NgbDateParserFormatter {
  private dateFormatString: string;

  constructor(private translate: TranslateService) {
    super();
    // magic accessing angulars internal locale api. Uses the short date format with long years.
    this.dateFormatString = ɵfindLocaleData(this.translate.currentLang)[10][0];
  }

  parse(value: string | undefined): NgbDateStruct | undefined {
    try {
      const date = parse(value, this.dateFormatString, new Date());
      return {
        year: date.getFullYear(),
        // addition because ES date is 0-indexed, NgbDateStruct is 1-indexed
        month: date.getMonth() + 1,
        day: date.getDate(),
      };
    } catch (err) {
      return;
    }
  }

  format(date: NgbDateStruct | undefined): string {
    // subtraction because ES date is 0-indexed, NgbDateStruct is 1-indexed
    return date ? format(new Date(date.year, date.month - 1, date.day), this.dateFormatString) : '';
  }
}
