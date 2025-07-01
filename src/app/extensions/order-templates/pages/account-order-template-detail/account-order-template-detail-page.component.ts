import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { Observable, Subject, takeUntil } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { mapToProperty } from 'ish-core/utils/operators';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplate, OrderTemplateItem } from '../../models/order-template/order-template.model';

@Component({
  selector: 'ish-account-order-template-detail-page',
  templateUrl: './account-order-template-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderTemplateDetailPageComponent implements OnInit, OnDestroy {
  orderTemplate$: Observable<OrderTemplate>;
  orderTemplateError$: Observable<HttpError>;
  orderTemplateLoading$: Observable<boolean>;

  noOfUnavailableProducts$: Observable<number>;

  form = new FormGroup({});
  model: { title: string };
  fields: FormlyFieldConfig[];

  titleControl = new FormControl('', { validators: [Validators.required] });
  private currentOrderTemplate: OrderTemplate;

  private destroy$ = new Subject<void>();

  constructor(private orderTemplatesFacade: OrderTemplatesFacade) {}

  ngOnInit() {
    this.orderTemplate$ = this.orderTemplatesFacade.currentOrderTemplate$;
    this.orderTemplateLoading$ = this.orderTemplatesFacade.orderTemplateLoading$;
    this.orderTemplateError$ = this.orderTemplatesFacade.orderTemplateError$;
    this.noOfUnavailableProducts$ = this.orderTemplatesFacade.currentOrderTemplateOutOfStockItems$.pipe(
      mapToProperty('length')
    );

    this.orderTemplate$.pipe(takeUntil(this.destroy$)).subscribe(orderTemplate => {
      if (orderTemplate) {
        this.currentOrderTemplate = orderTemplate;
        this.model = { title: orderTemplate.title };
        this.fields = this.getFields();
      }
    });
  }

  private getFields(): FormlyFieldConfig[] {
    return [
      {
        key: 'title',
        type: 'ish-text-input-field',
        wrappers: ['validation'],
        props: {
          required: true,
          ariaLabel: 'account.order_template.edit.name.label',
        },
        validation: {
          messages: {
            required: 'account.order_template.edit.name.error.required',
          },
        },
      },
    ];
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateTitle() {
    if (this.currentOrderTemplate && this.model.title && this.currentOrderTemplate.title !== this.model.title) {
      this.orderTemplatesFacade.updateOrderTemplate({
        ...this.currentOrderTemplate,
        title: this.model.title,
      });
    }
  }

  resetTitle() {
    this.orderTemplate$.pipe(takeUntil(this.destroy$)).subscribe(orderTemplate => {
      this.model = { ...this.model, title: orderTemplate.title };
    });
  }

  trackByFn(_: number, item: OrderTemplateItem) {
    return item.id;
  }
}
