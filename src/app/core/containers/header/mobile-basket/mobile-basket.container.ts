import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { getCurrentBasket } from '../../../../checkout/store/basket';
import { Basket } from '../../../../models/basket/basket.model';

@Component({
  selector: 'ish-mobile-basket-container',
  templateUrl: './mobile-basket.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MobileBasketContainerComponent implements OnInit {
  basket$: Observable<Basket>;

  constructor(private store: Store<{}>) {}

  ngOnInit() {
    this.basket$ = this.store.pipe(select(getCurrentBasket));
  }
}
