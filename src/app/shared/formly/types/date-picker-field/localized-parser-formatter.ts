import { Injectable, ɵfindLocaleData } from '@angular/core';
import { NgbDateParserFormatter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';

import { DateHelper } from 'ish-core/utils/date-helper';

/**
 * This service handles conversion between the NgbDateStruct used by NgbDatepicker and the string representation in the input field.
 *
 * Note that this is distinct from the internal date representation, wich is defined in `fixed-format-adapter.ts`.
 *
 * Currently, this uses angulars internal locale api to retrieve date formats.
 *
 * In the future, this will handled via a server configuration.
 */
@Injectable()
export class LocalizedParserFormatter extends NgbDateParserFormatter {
  private dateFormatString: string;
  constructor(private translate: TranslateService) {
    super();
    // magic accessing angulars internal locale api. Uses the short date format with long years. To be replaced with information from the rest api
    this.dateFormatString = ɵfindLocaleData(this.translate.currentLang)[10][0];
  }
  parse(value: string | undefined): NgbDateStruct | undefined {
    return DateHelper.fromStringToNgbDateStructFormatted(value, this.dateFormatString);
  }

  format(date: NgbDateStruct | undefined): string {
    return DateHelper.fromNgbDateStructToStringFormatted(date, this.dateFormatString);
  }
}
