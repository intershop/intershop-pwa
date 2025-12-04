import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { AddressComponent } from 'ish-shared/components/address/address/address.component';
import { BasketApprovalInfoComponent } from 'ish-shared/components/basket/basket-approval-info/basket-approval-info.component';
import { BasketBuyerComponent } from 'ish-shared/components/basket/basket-buyer/basket-buyer.component';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketErrorMessageComponent } from 'ish-shared/components/basket/basket-error-message/basket-error-message.component';
import { BasketMerchantMessageViewComponent } from 'ish-shared/components/basket/basket-merchant-message-view/basket-merchant-message-view.component';
import { BasketShippingMethodComponent } from 'ish-shared/components/basket/basket-shipping-method/basket-shipping-method.component';
import { BasketValidationResultsComponent } from 'ish-shared/components/basket/basket-validation-results/basket-validation-results.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { InfoBoxComponent } from 'ish-shared/components/common/info-box/info-box.component';
import { ModalDialogLinkComponent } from 'ish-shared/components/common/modal-dialog-link/modal-dialog-link.component';
import { SkipContentLinkComponent } from 'ish-shared/components/common/skip-content-link/skip-content-link.component';
import { LineItemListComponent } from 'ish-shared/components/line-item/line-item-list/line-item-list.component';
import { OrderRecurrenceComponent } from 'ish-shared/components/order/order-recurrence/order-recurrence.component';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { PaypalAdapterTypes, PaypalConfigService } from 'ish-core/utils/paypal/paypal-config/paypal-config.service';
import { PaymentPaypalComponent } from 'ish-shared/components/payment/payment-paypal/payment-paypal.component';

import { CheckoutReviewTacFieldComponent } from '../formly/checkout-review-tac-field/checkout-review-tac-field.component';

export const checkoutReviewFormlyConfig: ConfigOption = {
  types: [
    {
      name: 'ish-checkout-review-tac-field',
      component: CheckoutReviewTacFieldComponent,
    },
  ],
};

@Component({
  selector: 'ish-checkout-review',
  templateUrl: './checkout-review.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    TranslateModule,
    ModalDialogLinkComponent,
    ContentIncludeComponent,
    LazyLoadingContentDirective,
    ErrorMessageComponent,
    BasketErrorMessageComponent,
    BasketValidationResultsComponent,
    BasketApprovalInfoComponent,
    BasketMerchantMessageViewComponent,
    ServerSettingPipe,
    InfoBoxComponent,
    BasketBuyerComponent,
    FeatureToggleDirective,
    OrderRecurrenceComponent,
    AddressComponent,
    SkipContentLinkComponent,
    LineItemListComponent,
    BasketCostSummaryComponent,
    FormlyModule,
    ReactiveFormsModule,
    IconModule,
    BasketShippingMethodComponent,
    PaymentPaypalComponent,
  ],
})
export class CheckoutReviewComponent implements OnInit, OnChanges {
  @Input({ required: true }) basket: Basket;
  @Input() error: HttpError;
  @Input() submitting: boolean;
  @Output() readonly createOrder = new EventEmitter<void>();

  form = new FormGroup({});
  options: FormlyFormOptions = {};
  fields$: Observable<FormlyFieldConfig[]>;
  paypalPaymentMethod$: Observable<PaymentMethod | undefined>;

  model = { termsAndConditions: false };

  multipleBuckets = false;

  constructor(
    private appFacade: AppFacade,
    private checkoutFacade: CheckoutFacade,
    private paypalConfigService: PaypalConfigService
  ) {}

  ngOnInit() {
    this.fields$ = this.appFacade
      .serverSetting$<boolean>('basket.termsAndConditions')
      .pipe(map(enabled => (enabled ? this.setFields() : [])));

    this.paypalPaymentMethod$ = this.checkoutFacade.getBasketPaypalPaymentMethod();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.basket) {
      this.multipleBuckets = !this.basket?.commonShippingMethod || !this.basket?.commonShipToAddress;
    }
  }

  /**
   * sends an event to submit order
   */
  submitOrder() {
    if (this.form.valid && !this.multipleBuckets && !this.submitting) {
      this.createOrder.emit();
    }
  }

  /**
   * Determine the PayPal adapter type based on payment method capabilities.
   */
  getPaypalAdapterType(method?: PaymentMethod): PaypalAdapterTypes {
    return this.paypalConfigService.getPaypalAdapterType(method);
  }

  hasCustomFields(): boolean {
    return this.basket?.customFields && Object.keys(this.basket.customFields).length > 0;
  }

  private setFields() {
    return [
      {
        type: 'ish-checkout-review-tac-field',
        key: 'termsAndConditions',
        props: {
          required: true,
          validation: {
            show: true,
          },
        },
        validators: {
          validation: [Validators.pattern('true')],
        },
        validation: {
          messages: {
            pattern: 'checkout.tac.error.tip',
          },
        },
      },
    ];
  }
}
