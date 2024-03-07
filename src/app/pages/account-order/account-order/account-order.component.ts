import { ChangeDetectionStrategy, Component, Input, OnInit, Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Observable, combineLatest, map, of, startWith } from 'rxjs';

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
export class AccountOrderComponent implements OnInit {
  @Input({ required: true }) order: Order;

  basketLoading$: Observable<boolean>;
  buttonDisabled$: Observable<boolean>;
  loading$: Observable<boolean>;

  displaySpinner: Signal<boolean>;

  constructor(private checkoutFacade: CheckoutFacade, private shoppingFacade: ShoppingFacade) {
    this.basketLoading$ = this.checkoutFacade.basketLoading$;
    this.displaySpinner = toSignal(this.basketLoading$, { initialValue: false });
    this.loading$ = toObservable(this.displaySpinner).pipe(startWith(false));
  }

  ngOnInit() {
    // disable button when spinning, in case of an error or basket loading
    this.buttonDisabled$ = combineLatest([this.loading$, this.basketLoading$]).pipe(
      map(conditions => conditions.some(c => c))
    );
  }

  addToBasket() {
    this.order.lineItems.forEach(lineItem => {
      if (!lineItem.isFreeGift) {
        this.shoppingFacade.addProductToBasket(lineItem.productSKU, lineItem.quantity.value);
      }
    });

    // TODO: find solution, throws error:
    // Error: NG0203: toSignal() can only be used within an injection context such as a constructor, a factory function, a field initializer,
    // or a function used with `runInInjectionContext`. Find more at https://angular.io/errors/NG0203
    this.displaySpinner = toSignal(of(true));
  }
}
