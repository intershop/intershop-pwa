import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, concat, of, timer } from 'rxjs';
import { distinctUntilChanged, filter, map, mapTo, switchMap } from 'rxjs/operators';

import { getCurrentBasket } from '../../../../checkout/store/basket';
import { BasketHelper } from '../../../../models/basket/basket.model';

@Component({
  selector: 'ish-mini-basket-container',
  templateUrl: './mini-basket.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniBasketContainerComponent implements OnInit {
  basket$ = this.store.pipe(select(getCurrentBasket));
  basketAnimation$: Observable<string>;

  @Input()
  view: 'auto' | 'small' | 'full' = 'auto';
  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.basketAnimation$ = this.store.pipe(
      select(getCurrentBasket),
      map(a => (a && a.lineItems ? BasketHelper.getBasketItemsCount(a.lineItems) : 0)),
      distinctUntilChanged(),
      filter(a => a !== 0),
      switchMap(() => concat(of('tada'), timer(2000).pipe(mapTo(''))))
    );
  }
}
