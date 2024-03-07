import { ChangeDetectionStrategy, Component, DestroyRef, Input, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, combineLatest, map, startWith } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Order } from 'ish-core/models/order/order.model';
import { whenFalsy } from 'ish-core/utils/operators';

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
export class AccountOrderComponent implements OnInit {
  @Input({ required: true }) order: Order;

  basketLoading$: Observable<boolean>;

  buttonDisabled$: Observable<boolean>;

  constructor(private checkoutFacade: CheckoutFacade, private shoppingFacade: ShoppingFacade) {}

  // fires 'true' after add To Cart is clicked and basket is loading
  displaySpinner$ = new BehaviorSubject(false);

  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.basketLoading$ = this.checkoutFacade.basketLoading$;

    // update emitted to display spinning animation
    this.basketLoading$.pipe(whenFalsy(), takeUntilDestroyed(this.destroyRef)).subscribe(this.displaySpinner$); // false

    const loading$ = this.displaySpinner$.pipe(startWith(false));

    // disable button when spinning, in case of an error or basket loading
    this.buttonDisabled$ = combineLatest([loading$, this.basketLoading$]).pipe(
      map(conditions => conditions.some(c => c))
    );
  }

  addToBasket() {
    this.order.lineItems.forEach(lineItem => {
      if (!lineItem.isFreeGift) {
        this.shoppingFacade.addProductToBasket(lineItem.productSKU, lineItem.quantity.value);
      }
    });

    this.displaySpinner$.next(true);
  }
}
