import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, concat, of, timer } from 'rxjs';
import { distinctUntilChanged, filter, map, mapTo, switchMap } from 'rxjs/operators';

import { getCurrentBasket } from 'ish-core/store/checkout/basket';

@Component({
  selector: 'ish-mini-basket-container',
  templateUrl: './mini-basket.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniBasketContainerComponent implements OnInit {
  basket$ = this.store.pipe(select(getCurrentBasket));
  basketAnimation$: Observable<string>;

  @Input() view: 'auto' | 'small' | 'full' = 'auto';
  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.basketAnimation$ = this.store.pipe(
      select(getCurrentBasket),
      map(basket => (basket && basket.lineItems ? basket.totalProductQuantity : 0)),
      distinctUntilChanged(),
      filter(count => count !== 0),
      switchMap(() => concat(of('tada'), timer(2000).pipe(mapTo(''))))
    );
  }
}
