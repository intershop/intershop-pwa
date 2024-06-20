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
import { filter, map } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { OrderListQuery } from 'ish-core/models/order-list-query/order-list-query.model';
import { SelectOption } from 'ish-core/models/select-option/select-option.model';

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
  buyer?: string;
  allBuyers?: string;
}

type UrlModel = Partial<Record<'from' | 'to' | 'orderNo' | 'sku' | 'state' | 'buyer' | 'allBuyers', string | string[]>>;

function selectFirst(val: string | string[]): string {
  return Array.isArray(val) ? val[0] : val;
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
    buyer: model.buyer !== 'all' ? model.buyer : '',
    allBuyers: model.buyer === 'all' ? 'true' : '',
  });
}

function urlToQuery(model: FormModel): Partial<OrderListQuery> {
  return removeEmpty<Partial<OrderListQuery>>({
    creationDateFrom: model.date?.fromDate,
    creationDateTo: model.date?.toDate,
    documentNumber: selectArray(model.orderNo),
    lineItem_product: selectArray(model.sku),
    buyer: model.buyer !== 'all' ? model.buyer : '',
    allBuyers: model.buyer !== 'all' ? '' : 'true',
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

  model: FormModel;

  @Output() modelChange = new EventEmitter<Partial<OrderListQuery>>();

  private destroyRef = inject(DestroyRef);

  private buyers: SelectOption[] = [
    {
      value: 'all',
      label: 'account.order_history.filter.all_buyers',
    },
  ];

  formIsCollapsed = true;
  private hideBuyerField = true;

  constructor(private route: ActivatedRoute, private router: Router, private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.accountFacade.users$
      ?.pipe(
        map(users =>
          users?.map(user => ({ value: user.businessPartnerNo, label: `${user.firstName} ${user.lastName}` }))
        ),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(users => {
        users.forEach(user => this.buyers.push(user));
      });

    this.accountFacade.roles$
      .pipe(
        filter(roles => roles.map(roles => roles.roleId).includes('APP_B2B_ACCOUNT_OWNER')),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(value => {
        if (value) {
          this.hideBuyerField = false;
        }
      });

    this.fields = this.getFields();
    this.model = this.getModel();
  }

  ngAfterViewInit(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      if (
        Object.keys(params).length > 1 ||
        (Object.keys(params).length === 1 && Object.keys(params)[0] !== 'orderNo')
      ) {
        this.formIsCollapsed = false;
      }

      this.model = this.getModel(params);
      this.modelChange.emit(urlToQuery(this.model));
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
    this.navigate(modelToUrl(this.model));
  }

  resetForm() {
    this.navigate(undefined);
  }

  showResetButton(): boolean {
    const productId = this.form.get('sku')?.value;
    const date = this.form.get('date')?.value;

    return !this.formIsCollapsed && (!!productId || !!date);
  }

  private getFields(): FormlyFieldConfig[] {
    const basicFields = [
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
    ] as FormlyFieldConfig[];
    const buyerField = [
      {
        fieldGroupClassName: 'row justify-content-start',
        type: 'ish-fieldset-field',
        fieldGroup: [
          {
            type: 'ish-select-field',
            key: 'buyer',
            props: {
              label: 'account.order_history.filter.label.buyer',
              labelClass: 'col-md-12',
              fieldClass: 'col-md-6',
              options: this.buyers,
            },
          },
        ],
      },
    ] as FormlyFieldConfig;
    return this.hideBuyerField ? basicFields : basicFields.concat(buyerField);
  }

  private getModel(params?: UrlModel): FormModel {
    return {
      date:
        params?.from || params?.to
          ? {
              fromDate: params?.from ? selectFirst(params.from) : '',
              toDate: params?.to ? selectFirst(params.to) : '',
            }
          : undefined,
      orderNo: params?.orderNo ? selectFirst(params.orderNo) : '',
      sku: params?.sku ? selectFirst(params.sku) : '',
      state: params?.from ? selectFirst(params.state) : '',
      buyer: params?.buyer ? selectFirst(params.buyer) : this.hideBuyerField ? '' : 'all',
    };
  }
}
