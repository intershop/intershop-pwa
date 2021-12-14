import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { Order } from 'ish-core/models/order/order.model';

@Component({
  selector: 'ish-checkout-receipt-page',
  templateUrl: './checkout-receipt-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckoutReceiptPageComponent implements OnInit, OnDestroy {
  order$: Observable<Order>;
  loading$: Observable<boolean>;
  submittedBasket$: Observable<Basket>;

  order: string;
  private destroy$ = new Subject();

  constructor(
    private checkoutFacade: CheckoutFacade,
    private accountFacade: AccountFacade,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.order$ = this.checkoutFacade.selectedOrder$;
    this.loading$ = this.checkoutFacade.basketLoading$;
    this.submittedBasket$ = this.checkoutFacade.submittedBasket$;

    // fetch order ID from query params
    this.order = this.route.snapshot.queryParamMap.get('order') || undefined;

    this.checkoutFacade.submittedBasket$.pipe(
      tap((basket: Basket) => {
        if (basket) {
          // add query parameter with order ID
          this.router.navigate([], {
            relativeTo: this.route,
            queryParams: {
              order: basket.id,
            },
            queryParamsHandling: 'merge',
            skipLocationChange: true,
          });
        } else if (this.order) {
          // fetch last order
          this.order$ = this.accountFacade.selectedOrder$;
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
