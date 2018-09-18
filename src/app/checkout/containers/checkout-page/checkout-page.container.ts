import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { getCheckoutStep } from '../../store/viewconf';

@Component({
  templateUrl: './checkout-page.container.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CheckoutPageContainerComponent {
  checkoutStep$ = this.store.pipe(select(getCheckoutStep));

  constructor(private store: Store<{}>) {}
}
