import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, shareReplay } from 'rxjs';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Address } from 'ish-core/models/address/address.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { BasketCostSummaryComponent } from 'ish-shared/components/basket/basket-cost-summary/basket-cost-summary.component';
import { BasketErrorMessageComponent } from 'ish-shared/components/basket/basket-error-message/basket-error-message.component';
import { BasketItemsSummaryComponent } from 'ish-shared/components/basket/basket-items-summary/basket-items-summary.component';
import { BasketRecurrenceSummaryComponent } from 'ish-shared/components/basket/basket-recurrence-summary/basket-recurrence-summary.component';
import { BasketValidationResultsComponent } from 'ish-shared/components/basket/basket-validation-results/basket-validation-results.component';
import { BasketInvoiceAddressWidgetComponent } from 'ish-shared/components/checkout/basket-invoice-address-widget/basket-invoice-address-widget.component';
import { BasketShippingAddressWidgetComponent } from 'ish-shared/components/checkout/basket-shipping-address-widget/basket-shipping-address-widget.component';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';

/**
 * The Checkout Address Component renders the checkout address page. On this page the user can change invoice and shipping address and create a new invoice or shipping address, respectively.
 */
@Component({
  selector: 'ish-checkout-address',
  templateUrl: './checkout-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    TranslatePipe,
    ErrorMessageComponent,
    BasketErrorMessageComponent,
    BasketValidationResultsComponent,
    BasketInvoiceAddressWidgetComponent,
    BasketShippingAddressWidgetComponent,
    BasketRecurrenceSummaryComponent,
    BasketItemsSummaryComponent,
    BasketCostSummaryComponent,
    ServerHtmlDirective,
  ],
})
export class CheckoutAddressComponent implements OnInit {
  @Input({ required: true }) basket: Basket;
  @Input() error: HttpError;

  @Output() readonly nextStep = new EventEmitter<void>();

  eligibleAddresses$: Observable<Address[]>;

  // visible-for-testing
  submitted = false;
  active: 'invoice' | 'shipping';

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit(): void {
    this.eligibleAddresses$ = this.checkoutFacade.eligibleAddresses$().pipe(shareReplay(1));
  }

  /**
   * leads to next checkout page (checkout shipping)
   */
  goToNextStep() {
    this.submitted = true;
    if (!this.nextDisabled) {
      this.nextStep.emit();
    }
  }

  get nextDisabled() {
    return this.basket && (!this.basket.invoiceToAddress || !this.basket.commonShipToAddress) && this.submitted;
  }

  invoiceCollapsed(value: boolean) {
    if (!value) {
      this.active = 'invoice';
    }
  }

  shippingCollapsed(value: boolean) {
    if (!value) {
      this.active = 'shipping';
    }
  }
}
