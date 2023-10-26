import { ChangeDetectionStrategy, Component, Inject, Input } from '@angular/core';

import { ENABLE_CLEAR_BASKET_BUTTON } from 'ish-core/configurations/injection-keys';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { InjectSingle } from 'ish-core/utils/injection';

@Component({
  selector: 'ish-clear-basket',
  templateUrl: './clear-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClearBasketComponent {
  @Input() cssClass: string;

  constructor(
    @Inject(ENABLE_CLEAR_BASKET_BUTTON) public visible: InjectSingle<typeof ENABLE_CLEAR_BASKET_BUTTON>,
    private checkoutFacade: CheckoutFacade
  ) {}

  clearBasket() {
    this.checkoutFacade.deleteBasketItems();
  }
}
