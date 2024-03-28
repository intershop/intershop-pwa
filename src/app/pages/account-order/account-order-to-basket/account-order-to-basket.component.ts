import { ChangeDetectionStrategy, Component, Input, Signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Order } from 'ish-core/models/order/order.model';

/**
 * The Order to Basket Component displays a button that adds the current order to the basket.
 *
 * @example
 * <ish-account-order-to-basket [order]="order" />
 */
@Component({
  selector: 'ish-account-order-to-basket',
  templateUrl: './account-order-to-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountOrderToBasketComponent {
  @Input({ required: true }) order: Order;

  @Input() cssClass: string;

  basketLoading: Signal<boolean>;
  displaySpinner: Signal<boolean>;

  constructor(private checkoutFacade: CheckoutFacade, private shoppingFacade: ShoppingFacade) {
    this.basketLoading = toSignal(this.checkoutFacade.basketLoading$, { initialValue: false });
    this.displaySpinner = computed(() => this.basketLoading());
  }

  addOrderToBasket() {
    this.order.lineItems.forEach(lineItem => {
      if (!lineItem.isFreeGift) {
        this.shoppingFacade.addProductToBasket(lineItem.productSKU, lineItem.quantity.value);
      }
    });
  }
}
