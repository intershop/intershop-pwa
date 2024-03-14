import { ChangeDetectionStrategy, Component, Input, Signal, effect, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Order } from 'ish-core/models/order/order.model';

/**
 * The Order Page Component displays the details of an order.
 *
 * @example
 * <ish-order-page [order]="order"></ish-order-page>
 */
@Component({
  selector: 'ish-account-order',
  templateUrl: './account-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderComponent {
  @Input({ required: true }) order: Order;

  basketLoading: Signal<boolean>;
  displaySpinner = signal(false);

  constructor(private checkoutFacade: CheckoutFacade, private shoppingFacade: ShoppingFacade) {
    this.basketLoading = toSignal(this.checkoutFacade.basketLoading$, { initialValue: false });
    effect(
      () => {
        if (!this.basketLoading()) {
          this.displaySpinner.set(this.basketLoading());
        }
      },
      { allowSignalWrites: true }
    );
  }

  addOrderToBasket() {
    this.displaySpinner.set(true);

    this.order.lineItems.forEach(lineItem => {
      if (!lineItem.isFreeGift) {
        this.shoppingFacade.addProductToBasket(lineItem.productSKU, lineItem.quantity.value);
      }
    });
  }
}
