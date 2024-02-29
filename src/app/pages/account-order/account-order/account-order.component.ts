import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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

  constructor(private shoppingFacade: ShoppingFacade) {}

  addToBasket() {
    this.order.lineItems.forEach(lineItem => {
      this.shoppingFacade.addProductToBasket(lineItem.productSKU, lineItem.quantity.value);
    });
  }
}
