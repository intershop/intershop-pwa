import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NgbCalendar,
  NgbDate,
  NgbDateAdapter,
  NgbDateParserFormatter,
  NgbDateStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { FieldType, FieldTypeConfig } from '@ngx-formly/core';
import { Observable, isObservable, map, of } from 'rxjs';

import { ariaDescribedByIds } from 'ish-shared/forms/utils/form-utils';

function toObservableNumber(days: number | Observable<number>) {
  const days$ = isObservable(days) ? days : of(days);
  return days$.pipe(map(daysLoc => (typeof daysLoc === 'number' ? daysLoc : undefined)));
}

/**
 * Form control for picking a date range.
 * Uses NgbDatepicker with custom formatting and parsing.
 * Refer to `fixed-format-adapter.ts` and `localized-parser-formatter.ts` for more information on date formatting.
 *
 * @props **minDays** - computes the minDate by adding the minimum allowed days to today.
 * @props **maxDays** - computes the maxDate by adding the maximum allowed days to today.
 * @props **startDate** - the start date.
 * @props **placeholder** - placeholder that displays the date format in the input field.
 * @props **inputClass** - class to apply to the input field
 *
 * @defaultWrappers 'form-field-horizontal', 'validation'
 *
 *
 */
@Component({
  selector: 'ish-date-range-picker-field',
  templateUrl: './date-range-picker-field.component.html',
  styleUrls: ['./date-range-picker-field.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DateRangePickerFieldComponent extends FieldType<FieldTypeConfig> implements AfterViewInit {
  hoveredDate: NgbDateStruct;

  private destroyRef = inject(DestroyRef);

  constructor(
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private adapter: NgbDateAdapter<unknown>,
    private cdRef: ChangeDetectorRef
  ) {
    super();
  }

  ngAfterViewInit(): void {
    this.formControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.cdRef.markForCheck());
  }

  get fromDate() {
    return this.adapter.fromModel(this.formControl.getRawValue()?.fromDate);
  }

  set fromDate(value: NgbDateStruct) {
    const oldValue = this.formControl.getRawValue() || {};
    this.formControl.setValue({ ...oldValue, fromDate: this.adapter.toModel(value) });
  }

  get toDate() {
    return this.adapter.fromModel(this.formControl.getRawValue()?.toDate);
  }

  set toDate(value: NgbDateStruct) {
    const oldValue = this.formControl.getRawValue() || {};
    this.formControl.setValue({ ...oldValue, toDate: this.adapter.toModel(value) });
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate) {
      this.fromDate = date;
    } else if (!this.toDate && date && date.equals(this.fromDate)) {
      this.toDate = date;
    } else if (this.fromDate && !this.toDate && date && date.after(this.fromDate)) {
      this.toDate = date;
    } else {
      this.toDate = undefined;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return (
      this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  validateInput(currentValue: NgbDateStruct, input: string): NgbDateStruct {
    if (input) {
      const parsed = this.formatter.parse(input);
      return parsed && this.calendar.isValid(NgbDate.from(parsed)) ? NgbDate.from(parsed) : currentValue;
    }
  }

  private addDaysToToday$(days$: Observable<number | undefined>): Observable<NgbDateStruct | undefined> {
    return days$.pipe(
      map(daysLoc =>
        typeof daysLoc === 'number' ? this.calendar.getNext(this.calendar.getToday(), 'd', daysLoc) : undefined
      )
    );
  }

  get minDate$(): Observable<NgbDateStruct> {
    const minDays$ = toObservableNumber(this.props.minDays);
    return this.addDaysToToday$(minDays$);
  }

  get maxDate$(): Observable<NgbDateStruct> {
    const maxDays$ = toObservableNumber(this.props.maxDays);
    return this.addDaysToToday$(maxDays$);
  }

  get startDate$(): Observable<NgbDateStruct> {
    const startDate$ = toObservableNumber(this.props.startDate);
    return this.addDaysToToday$(startDate$);
  }

  get ariaDescribedByIds(): string | null {
    return ariaDescribedByIds(this.field.id, this.showError, this.props.customDescription);
  }
}
