/* eslint-disable unicorn/no-null */
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { formatISO, parseISO } from 'date-fns';
import { isEqual } from 'lodash-es';
import { debounceTime, distinctUntilChanged, skip } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Recurrence } from 'ish-core/models/recurrence/recurrence.model';

interface RecurrenceFormData {
  period: string;
  duration: string;
  startDate: Date;
  endDate?: Date;
  repetitions?: number;
  ending: 'date' | 'repetitions';
}

@Component({
  selector: 'ish-basket-order-recurrence-edit',
  templateUrl: './basket-order-recurrence-edit.component.html',
  styleUrls: ['./basket-order-recurrence-edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasketOrderRecurrenceEditComponent implements OnChanges, OnInit {
  @Input() recurrence: Recurrence;

  // default order recurrence value: weekly recurrence starting today
  defaultRecurrence: Recurrence = {
    interval: 'P1W',
    startDate: formatISO(new Date()),
  };

  private periodOptions = [
    { value: 'D', label: `order.recurrence.period.days` },
    { value: 'W', label: `order.recurrence.period.weeks` },
    { value: 'M', label: `order.recurrence.period.months` },
    { value: 'Y', label: `order.recurrence.period.years` },
  ];

  form = new UntypedFormGroup({});
  model: RecurrenceFormData;
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'duration',
          type: 'ish-number-field',
          className: 'col-12 col-lg-5',
          props: {
            label: 'order.recurrence.form.duration.label',
            labelClass: 'col-md-12',
            fieldClass: 'col-md-12',
            min: 1,
          },
        },
        {
          key: 'period',
          type: 'ish-select-field',
          className: 'col-12 col-lg-7',
          props: {
            options: this.periodOptions,
            label: 'order.recurrence.form.period.label',
            labelClass: 'col-md-12 hidden d-none d-lg-block',
            fieldClass: 'col-md-12',
          },
        },
      ],
    },
    {
      key: 'startDate',
      type: 'ish-date-picker-field',
      props: {
        label: 'order.recurrence.form.startDate.label',
        minDays: 0,
        labelClass: 'col-md-12',
        fieldClass: 'col-md-12',
      },
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'ending',
          type: 'ish-radio-field',
          className: 'col-12 col-md-3',
          props: {
            label: 'order.recurrence.form.ending.date.label',
            value: 'date',
            labelClass: 'col-md-12 pl-0',
            fieldClass: 'col-md-12',
          },
        },
        {
          key: 'endDate',
          type: 'ish-date-picker-field',
          className: 'col-12 col-md-9',
          props: {
            placeholder: 'mm/dd/yy',
            labelClass: 'col-md-12',
            fieldClass: 'col-md-12',
          },
          expressions: {
            'props.disabled': 'model.ending === "repetitions"',
            'props.minDays': field => this.calculateMinimumEndDate(field.model.startDate),
            'model.endDate': 'model.repetitions || model.ending === "repetitions" ? null : model.endDate',
          },
        },
      ],
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'ending',
          type: 'ish-radio-field',
          className: 'col-12 col-md-3 col-lg-5 mr-lg-0',
          props: {
            label: 'order.recurrence.form.ending.repetitions.label',
            value: 'repetitions',
            labelClass: 'col-md-12 pl-0',
            fieldClass: 'col-md-12',
          },
        },
        {
          key: 'repetitions',
          type: 'ish-number-field',
          className: 'col-5 col-md-4 col-lg-3 pl-md-3 pl-lg-0 pr-md-0',
          props: {
            labelClass: 'col-md-12',
            fieldClass: 'col-md-12',
            inputClass: 'testClass',
            min: 1,
          },
          expressions: {
            'props.disabled': 'model.ending !== "repetitions"',
            'model.repetitions':
              'model.endDate || model.ending === "date" ? null : model.repetitions ? model.repetitions : 50',
          },
        },
        {
          type: 'ish-information-field',
          className: 'col-7 col-md-5 col-lg-4 pl-0 pt-2 pt-md-0',
          props: {
            containerClass: 'p-md-2',
            localizationKey: 'order.recurrence.form.info.text',
          },
        },
      ],
    },
  ];

  private destroyRef = inject(DestroyRef);

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit(): void {
    // save changes after form values changed and an update is necessary
    this.form.valueChanges
      .pipe(skip(1), debounceTime(1000), distinctUntilChanged(isEqual), takeUntilDestroyed(this.destroyRef))
      .subscribe(data => {
        if (this.formDataDifferentToRecurrence(data)) {
          this.updateOrderRecurrence(this.mapFormDataToRecurrence(data));
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!isEqual(changes.recurrence.currentValue, changes.recurrence.previousValue)) {
      this.model = this.getModel(this.recurrence);
    }
  }

  updateOrderRecurrence(updateData: Recurrence | null) {
    if (updateData) {
      // update order recurrence with form values (or default value)
      this.checkoutFacade.updateBasketRecurrence(updateData);
    } else {
      // remove order recurrence
      this.checkoutFacade.updateBasketRecurrence(null);
    }
  }

  private getModel(recurrence: Recurrence): RecurrenceFormData {
    if (!recurrence) {
      return;
    }
    let period = recurrence.interval.slice(-1).toUpperCase();
    let duration = parseInt(recurrence.interval.slice(1, -1), 10);
    // convert days to weeks if possible since the API only returns daily, monthly or yearly intervals
    if (period === 'D' && duration % 7 === 0) {
      period = 'W';
      duration = duration / 7;
    }
    return {
      period,
      duration: duration.toString(),
      startDate: parseISO(recurrence.startDate),
      endDate: recurrence.endDate ? parseISO(recurrence.endDate) : undefined,
      repetitions: recurrence.repetitions,
      ending: recurrence.repetitions ? 'repetitions' : 'date',
    };
  }

  private mapFormDataToRecurrence(data: RecurrenceFormData): Recurrence {
    if (!data) {
      return;
    }
    return {
      interval: `P${data.duration}${data.period}`,
      startDate: formatISO(data.startDate),
      endDate: data.endDate ? formatISO(data.endDate) : null,
      repetitions: data.repetitions ? data.repetitions : null,
    };
  }

  private formDataDifferentToRecurrence(data: RecurrenceFormData): boolean {
    if (!data) {
      return false;
    }
    const recurrence = this.mapFormDataToRecurrence(data);
    if (recurrence.interval.endsWith('W')) {
      recurrence.interval = `P${parseInt(recurrence.interval.slice(1, -1), 10) * 7}D`;
    }
    return (
      this.recurrence.interval !== recurrence.interval ||
      this.recurrence.startDate.slice(0, 10) !== recurrence.startDate.slice(0, 10) ||
      this.recurrence.endDate?.slice(0, 10) !== recurrence.endDate?.slice(0, 10) ||
      // eslint-disable-next-line eqeqeq
      this.recurrence.repetitions != recurrence.repetitions
    );
  }

  private calculateMinimumEndDate(startDate: string): number {
    const date1 = new Date(startDate);
    const date2 = new Date();
    const difference = date1.getTime() - date2.getTime();
    return Math.ceil(difference / (1000 * 3600 * 24)) || 1;
  }
}
