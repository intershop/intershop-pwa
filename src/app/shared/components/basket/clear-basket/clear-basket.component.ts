import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';

@Component({
  selector: 'ish-clear-basket',
  templateUrl: './clear-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClearBasketComponent {
  @Input() cssClass: string;

  constructor(private checkoutFacade: CheckoutFacade) {}

  clearBasket() {
    this.checkoutFacade.deleteBasketItems();
  }
}
