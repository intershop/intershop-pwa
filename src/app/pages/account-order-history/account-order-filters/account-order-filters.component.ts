import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Injectable,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbDateAdapter, NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { OrderListQuery } from 'ish-core/models/order-list-query/order-list-query.model';

@Injectable()
export class OrderDateFilterAdapter extends NgbDateAdapter<string> {
  fromModel(value: string): NgbDateStruct {
    if (value) {
      const dateParts = value.split('-');
      return {
        year: +dateParts[0],
        month: +dateParts[1],
        day: +dateParts[2],
      };
    }
  }
  toModel(date: NgbDateStruct): string {
    if (date) {
      return `${date.year}-${date.month.toString().padStart(2, '0')}-${date.day.toString().padStart(2, '0')}`;
    }
  }
}

interface FormModel extends Record<string, unknown> {
  date?: {
    fromDate: string;
    toDate: string;
  };
  orderNo?: string;
  sku?: string;
  state?: string;
}

type UrlModel = Partial<Record<'from' | 'to' | 'orderNo' | 'sku' | 'state', string | string[]>>;

function selectFirst(val: string | string[]): string {
  return Array.isArray(val) ? val[0] : val;
}

function selectAll(val: string | string[]): string {
  return Array.isArray(val) ? val.join(',') : val;
}

function selectArray(val: string | string[]): string[] {
  if (!val) {
    return;
  }
  return Array.isArray(val) ? val : [val];
}

function removeEmpty<T extends Record<string, unknown>>(obj: T): T {
  return Object.keys(obj).reduce<Record<string, unknown>>((acc, key) => {
    if (Array.isArray(obj[key])) {
      if ((obj[key] as unknown[]).length > 0) {
        acc[key] = obj[key];
      }
    } else if (obj[key]) {
      acc[key] = obj[key];
    }
    return acc;
  }, {}) as T;
}

function urlToModel(params: UrlModel): FormModel {
  return removeEmpty<FormModel>({
    date: {
      fromDate: selectFirst(params.from),
      toDate: selectFirst(params.to),
    },
    orderNo: selectAll(params.orderNo),
    sku: selectAll(params.sku),
    state: selectFirst(params.state),
  });
}

function modelToUrl(model: FormModel): UrlModel {
  return removeEmpty<UrlModel>({
    from: model.date?.fromDate,
    to: model.date?.toDate,
    orderNo: model.orderNo?.split(',').map(s => s.trim()),
    sku: model.sku?.split(',').map(s => s.trim()),
    state: model.state
      ?.split(',')
      .map(s => s.trim())
      .filter(x => !!x),
  });
}

function urlToQuery(params: UrlModel): Partial<OrderListQuery> {
  return removeEmpty<Partial<OrderListQuery>>({
    creationDateFrom: selectFirst(params.from),
    creationDateTo: selectFirst(params.to),
    documentNumber: selectArray(params.orderNo),
    lineItem_product: selectArray(params.sku),
  });
}

@Component({
  selector: 'ish-account-order-filters',
  templateUrl: './account-order-filters.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NgbDateAdapter, useClass: OrderDateFilterAdapter }],
})
export class AccountOrderFiltersComponent implements OnInit, AfterViewInit {
  @Input() fragmentOnRouting: string;

  form = new UntypedFormGroup({});

  fields: FormlyFieldConfig[];

  @Output() modelChange = new EventEmitter<Partial<OrderListQuery>>();

  private destroyRef = inject(DestroyRef);

  formIsCollapsed = true;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.fields = [
      {
        key: 'orderNo',
        type: 'ish-text-input-field',
        props: {
          placeholder: 'account.order_history.filter.label.order_no',
          fieldClass: 'col-12',
        },
      },
      {
        fieldGroupClassName: 'row',
        fieldGroup: [
          {
            className: 'col-12 col-md-6',
            key: 'sku',
            type: 'ish-text-input-field',
            props: {
              label: 'account.order_history.filter.label.sku',
              placeholder: 'account.order_history.filter.label.sku',
              labelClass: 'col-md-6',
              fieldClass: 'col-md-12',
            },
          },
          {
            className: 'col-12 col-md-6',
            key: 'date',
            type: 'ish-date-range-picker-field',
            props: {
              label: 'account.order_history.filter.label.date',
              placeholder: 'checkout.desired_delivery_date.note',
              minDays: -365 * 10,
              maxDays: 0,
              startDate: -30,
              labelClass: 'col-md-6',
              fieldClass: 'col-md-12',
            },
          },
        ],
      },
    ];
  }

  ngAfterViewInit(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.form.patchValue(urlToModel(params));
      this.modelChange.emit(urlToQuery(params));
    });
  }

  private navigate(queryParams: UrlModel) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      fragment: this.fragmentOnRouting,
    });
  }

  expandForm() {
    this.formIsCollapsed = !this.formIsCollapsed;
  }

  submitForm() {
    this.navigate(modelToUrl(this.form.value));
  }

  resetForm() {
    this.navigate(undefined);
  }

  showResetButton(): boolean {
    const productId = this.form.get('sku')?.value;
    const date = this.form.get('date')?.value;

    return !this.formIsCollapsed && (!!productId || !!date);
  }
}
