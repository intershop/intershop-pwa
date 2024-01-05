import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Address } from 'ish-core/models/address/address.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

/**
 * The Checkout Address Component renders the checkout address page. On this page the user can change invoice and shipping address and create a new invoice or shipping address, respectively.
 */
@Component({
  selector: 'ish-checkout-address',
  templateUrl: './checkout-address.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutAddressComponent implements OnInit {
  @Input({ required: true }) basket: Basket;
  @Input() error: HttpError;

  @Output() nextStep = new EventEmitter<void>();

  eligibleAddresses$: Observable<Address[]>;

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
