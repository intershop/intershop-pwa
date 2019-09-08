import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable, concat, of, timer } from 'rxjs';
import { distinctUntilChanged, mapTo, switchMap } from 'rxjs/operators';

import { getBasketError, getBasketLastTimeProductAdded, getCurrentBasket } from 'ish-core/store/checkout/basket';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'ish-mini-basket-container',
  templateUrl: './mini-basket.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniBasketContainerComponent implements OnInit {
  basket$ = this.store.pipe(select(getCurrentBasket));
  basketError$ = this.store.pipe(select(getBasketError));
  basketAnimation$: Observable<string>;

  @Input() view: 'auto' | 'small' | 'full' = 'auto';

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.basketAnimation$ = this.store.pipe(
      select(getBasketLastTimeProductAdded),
      whenTruthy(),
      distinctUntilChanged(),
      switchMap(() => concat(of('tada'), timer(2500).pipe(mapTo(''))))
    );
  }
}
