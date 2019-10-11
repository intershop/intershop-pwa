import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable, concat, of, timer } from 'rxjs';
import { distinctUntilChanged, mapTo, switchMap } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Basket } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-mini-basket-container',
  templateUrl: './mini-basket.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniBasketContainerComponent implements OnInit {
  basket$: Observable<Basket>;
  basketError$: Observable<HttpError>;
  basketAnimation$: Observable<string>;

  @Input() view: 'auto' | 'small' | 'full' = 'auto';

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.basket$ = this.checkoutFacade.basket$;
    this.basketError$ = this.checkoutFacade.basketError$;
    this.basketAnimation$ = this.checkoutFacade.basketChange$.pipe(
      whenTruthy(),
      distinctUntilChanged(),
      switchMap(() => concat(of('tada'), timer(2500).pipe(mapTo(''))))
    );
  }
}
