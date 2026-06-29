import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FormlyFieldConfig, FormlyForm } from '@ngx-formly/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, take } from 'rxjs';

import { ProductContextDirective } from 'ish-core/directives/product-context.directive';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { mapToProperty, whenTruthy } from 'ish-core/utils/operators';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { InPlaceEditComponent } from 'ish-shared/components/common/in-place-edit/in-place-edit.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';

import { OrderTemplatesFacade } from '../../facades/order-templates.facade';
import { OrderTemplate } from '../../models/order-template/order-template.model';

import { AccountOrderTemplateDetailLineItemComponent } from './account-order-template-detail-line-item/account-order-template-detail-line-item.component';

@Component({
  selector: 'ish-account-order-template-detail-page',
  imports: [
    AccountOrderTemplateDetailLineItemComponent,
    AsyncPipe,
    ErrorMessageComponent,
    FormlyForm,
    InPlaceEditComponent,
    LoadingComponent,
    ProductAddToBasketComponent,
    ProductContextDirective,
    RouterLink,
    TranslatePipe,
  ],
  standalone: true,
  templateUrl: './account-order-template-detail-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderTemplateDetailPageComponent implements OnInit {
  orderTemplate$: Observable<OrderTemplate>;
  orderTemplateError$: Observable<HttpError>;
  orderTemplateLoading$: Observable<boolean>;

  noOfUnavailableProducts$: Observable<number>;

  form = new FormGroup({});
  model: { title: string };
  fields: FormlyFieldConfig[];

  private currentOrderTemplate: OrderTemplate;

  private destroyRef = inject(DestroyRef);

  constructor(private orderTemplatesFacade: OrderTemplatesFacade) {}

  ngOnInit() {
    this.orderTemplate$ = this.orderTemplatesFacade.currentOrderTemplate$;
    this.orderTemplateLoading$ = this.orderTemplatesFacade.orderTemplateLoading$;
    this.orderTemplateError$ = this.orderTemplatesFacade.orderTemplateError$;
    this.noOfUnavailableProducts$ = this.orderTemplatesFacade.currentOrderTemplateOutOfStockItems$.pipe(
      mapToProperty('length')
    );

    this.orderTemplate$.pipe(whenTruthy(), takeUntilDestroyed(this.destroyRef)).subscribe(orderTemplate => {
      this.currentOrderTemplate = orderTemplate;
      this.model = { title: orderTemplate.title };
      this.fields = this.getFields();
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
          showValidation: () => false,
        },
        validation: {
          messages: {
            required: 'account.order_template.edit.name.error.required',
          },
        },
      },
    ];
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
    this.orderTemplate$
      .pipe(whenTruthy(), take(1), takeUntilDestroyed(this.destroyRef))
      .subscribe(orderTemplate => (this.model = { ...this.model, title: orderTemplate.title }));
  }
}
