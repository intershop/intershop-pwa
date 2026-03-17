/* eslint-disable unicorn/no-null */
import { AsyncPipe } from '@angular/common';
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
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';
import { formatISO, parseISO } from 'date-fns';
import { isEqual } from 'lodash-es';
import { debounceTime, distinctUntilChanged, filter, map, skip } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Recurrence } from 'ish-core/models/recurrence/recurrence.model';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';

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
  standalone: true,
  imports: [TranslatePipe, ContentIncludeComponent, NgbCollapse, ReactiveFormsModule, FormlyForm, AsyncPipe],
})
export class BasketOrderRecurrenceEditComponent implements OnChanges, OnInit {
  @Input({ required: true }) recurrence: Recurrence;

  // default order recurrence value: weekly recurrence starting today
  readonly defaultRecurrence: Recurrence = {
    interval: 'P1W',
    startDate: formatISO(new Date()),
  };
  private readonly defaultNumberOfOrders = 10; // default number of orders for a recurrence

  private periodOptions = [
    { value: 'D', label: `order.recurrence.period.days` },
    { value: 'W', label: `order.recurrence.period.weeks` },
    { value: 'M', label: `order.recurrence.period.months` },
    { value: 'Y', label: `order.recurrence.period.years` }];

  form = new FormGroup({});
  model: RecurrenceFormData;
  fields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'duration',
          type: 'ish-number-field',
          className: 'col-6',
          props: {
            label: 'order.recurrence.form.duration.label',
            labelClass: 'col-12 text-nowrap',
            fieldClass: 'col-md-12',
            ariaLabel: 'order.recurrence.form.duration.aria_label',
            min: 1,
            required: true,
            hideRequiredMarker: true,
          },
        },
        {
          key: 'period',
          type: 'ish-select-field',
          className: 'col-6 ps-0',
          props: {
            options: this.periodOptions,
            label: 'order.recurrence.form.period.label',
            labelClass: 'col-md-12 invisible',
            fieldClass: 'col-md-12',
            ariaLabel: 'order.recurrence.form.period.aria_label',
          },
        }],
    },
    {
      key: 'startDate',
      type: 'ish-date-picker-field',
      props: {
        label: 'order.recurrence.form.start.date.label',
        placeholder: 'order.recurrence.form.date.placeholder',
        minDays: 0,
        labelClass: 'col-md-12',
        fieldClass: 'col-md-12',
        ariaLabel: 'order.recurrence.form.start.date.aria_label',
        required: true,
        hideRequiredMarker: true,
      },
      validation: {
        messages: {
          required: 'form.date.error.required',
          ngbDate: 'form.date.error.invalid',
        },
      },
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'ending',
          type: 'ish-radio-field',
          className: 'col-12 col-md-3 col-lg-4 pe-md-0',
          props: {
            label: 'order.recurrence.form.ending.date.label',
            value: 'date',
            labelClass: 'col-md-12 ps-0 d-inline',
            fieldClass: 'col-md-12',
          },
        },
        {
          key: 'endDate',
          type: 'ish-date-picker-field',
          className: 'col-12 col-md-9 col-lg-8',
          props: {
            placeholder: 'order.recurrence.form.date.placeholder',
            labelClass: 'col-md-12',
            fieldClass: 'col-md-12',
            ariaLabel: 'order.recurrence.form.ending.date.aria_label',
          },
          validation: {
            messages: {
              ngbDate: 'form.date.error.invalid',
            },
          },
          expressions: {
            'props.disabled': 'model.ending !== "date"',
            'props.minDays': field => this.calculateMinimumEndDate(field.model.startDate),
          },
        }],
    },
    {
      fieldGroupClassName: 'row',
      fieldGroup: [
        {
          key: 'ending',
          type: 'ish-radio-field',
          className: 'col-12 col-md-3 col-lg-5 me-lg-0',
          props: {
            label: 'order.recurrence.form.ending.repetitions.label',
            value: 'repetitions',
            labelClass: 'col-md-12 ps-0 d-inline',
            fieldClass: 'col-md-12',
          },
        },
        {
          key: 'repetitions',
          type: 'ish-number-field',
          className: 'col-12 col-md-4 col-lg-7 ps-lg-0',
          props: {
            postWrappers: [{ wrapper: 'information', index: -1 }],
            labelClass: 'col-md-12',
            fieldClass: 'col-md-12',
            inputClass: 'testClass',
            ariaLabel: 'order.recurrence.form.ending.repetitions.aria_label',
            min: 1,
            required: true,
            hideRequiredMarker: true,
            customInformation: {
              key: 'order.recurrence.form.info.text',
              ariaHidden: true,
            },
          },
          expressions: {
            'props.disabled': 'model.ending !== "repetitions"',
          },
        }],
    }];

  private destroyRef = inject(DestroyRef);

  constructor(private checkoutFacade: CheckoutFacade) {}

  // show the recurrence options if a recurrence is already set at the basket or if the basket can be used for recurring orders
  showRecurrenceOptions$ = this.checkoutFacade.canUseBasketForRecurringOrder$.pipe(
    map(canUseBasketForRecurringOrder => this.recurrence || canUseBasketForRecurringOrder)
  );

  ngOnInit(): void {
    // handle setting default repetitions when switching the ending between date and repetitions mode
    this.form.valueChanges
      .pipe(
        map((value: Partial<RecurrenceFormData>) => value.ending),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(ending => {
        if (ending === 'repetitions') {
          this.model = {
            ...this.model,
            repetitions: this.model.repetitions ?? this.defaultNumberOfOrders,
            endDate: undefined,
          };
        } else if (ending === 'date') {
          this.model = { ...this.model, repetitions: undefined };
        }
      });

    // save changes after form values changed to valid new values and an update is necessary
    this.form.valueChanges
      .pipe(
        skip(1),
        debounceTime(800),
        filter(() => this.form.valid),
        distinctUntilChanged(isEqual),
        takeUntilDestroyed(this.destroyRef)
      )
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

    const currentStartDate = parseISO(recurrence.startDate);
    const defaultStartDate = parseISO(this.defaultRecurrence.startDate);

    return {
      period,
      duration: duration.toString(),
      // Auto-correct start date if it's in the past by setting it to today's date
      // This prevents validation errors when the basket contains recurring order information with past dates
      startDate: currentStartDate < defaultStartDate ? defaultStartDate : currentStartDate,
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
    if (!recurrence) {
      return false;
    }

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
