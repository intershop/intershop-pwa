import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, from, timer } from 'rxjs';
import { delayWhen, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators';

import { getCurrentBasket } from '../../../../checkout/store/basket';
import { BasketHelper, BasketView } from '../../../../models/basket/basket.model';

@Component({
  selector: 'ish-mini-basket-container',
  templateUrl: './mini-basket.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniBasketContainerComponent implements OnInit {
  basket$: Observable<BasketView>;
  basketAnimation$: Observable<string>;

  @Input()
  view: 'auto' | 'small' | 'full' = 'auto';
  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.basket$ = this.store.pipe(select(getCurrentBasket));
    this.basketAnimation$ = this.store.pipe(
      select(getCurrentBasket),
      map(a => (a && a.lineItems ? BasketHelper.getBasketItemsCount(a.lineItems) : 0)),
      distinctUntilChanged(),
      filter(a => a !== 0),
      switchMap(() => from(['tada', '']).pipe(delayWhen(x => timer(x === '' ? 2000 : 0))))
    );
  }
}
