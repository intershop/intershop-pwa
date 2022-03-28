import { Injectable } from '@angular/core';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

import { DateHelper } from 'ish-core/utils/date-helper';

/**
 * This service handles how the date is represented in the formly model and form value.
 *
 * Uses a fixed format string that is retrieved from `DateHelper`.
 */
@Injectable()
export class FixedFormatAdapter extends NgbDateAdapter<string> {
  readonly formatString = DateHelper.internalFormatString;

  fromModel(value: string | undefined): NgbDateStruct | undefined {
    return DateHelper.fromStringToNgbDateStructFormatted(value, this.formatString);
  }

  toModel(date: NgbDateStruct | undefined): string | undefined {
    return DateHelper.fromNgbDateStructToStringFormatted(date, this.formatString);
  }
}
