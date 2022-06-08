import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgbCalendar, NgbDate, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { Observable, combineLatest, isObservable, map, of } from 'rxjs';

/**
 * Type for a  date-picker field.
 * Uses NgbDatepicker with custom formatting and parsing.
 * Refer to `fixed-format-adapter.ts` and `localized-parser-formatter.ts` for more information on date formatting.
 *
 * @templateOption **minDays** - computes the minDate by adding the minimum allowed days to today.
 * @templateOption **maxDays** - computes the maxDate by adding the maximum allowed days to today.
 * @templateOption **isSatExcluded** - specifies if saturdays can be disabled.
 * @templateOption **isSunExcluded** - specifies if sundays can be disabled.
 * @templateOption **inputClass** - class to apply to the input field
 *
 * @defaultWrappers 'form-field-horizontal', 'validation'
 *
 *
 */
@Component({
  selector: 'ish-date-picker-field',
  templateUrl: './date-picker-field.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerFieldComponent extends FieldType<FieldTypeConfig> {
  constructor(private calendar: NgbCalendar) {
    super();
  }

  addDaysToToday$(days$: Observable<number | undefined>): Observable<NgbDateStruct | undefined> {
    return days$.pipe(
      map(daysLoc =>
        typeof daysLoc === 'number' ? this.calendar.getNext(this.calendar.getToday(), 'd', daysLoc) : undefined
      )
    );
  }

  get minDate$(): Observable<NgbDateStruct> {
    const minDays$ = this.toObservableNumber('minDays');
    return this.addDaysToToday$(minDays$);
  }

  get maxDate$(): Observable<NgbDateStruct> {
    const maxDays$ = this.toObservableNumber('maxDays');
    return this.addDaysToToday$(maxDays$);
  }

  get markDateDisable$() {
    const isSatExcluded$ = isObservable(this.to.isSatExcluded) ? this.to.isSatExcluded : of(this.to.isSatExcluded);
    const isSunExcluded$ = isObservable(this.to.isSunExcluded) ? this.to.isSunExcluded : of(this.to.isSunExcluded);

    return combineLatest([isSatExcluded$, isSunExcluded$]).pipe(
      map(([isSatExcluded, isSunExcluded]) => (date: NgbDate) => {
        const disableSaturday = isSatExcluded === true ? this.calendar.getWeekday(date) === 6 : false;
        const disableSunday = isSunExcluded === true ? this.calendar.getWeekday(date) === 7 : false;
        return disableSaturday || disableSunday;
      })
    );
  }

  private toObservableNumber(daysType: 'minDays' | 'maxDays') {
    const days = daysType === 'minDays' ? this.to.minDays : this.to.maxDays;
    const days$ = isObservable(days) ? days : of(days);
    return days$.pipe(map(daysLoc => (typeof daysLoc === 'number' ? daysLoc : undefined)));
  }
}
