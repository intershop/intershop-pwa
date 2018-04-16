import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { getCurrentBasket } from '../../../../checkout/store/basket';
import { CheckoutState } from '../../../../checkout/store/checkout.state';
import { Basket } from '../../../../models/basket/basket.model';
import { Region } from '../../../../models/region/region.model';

@Component({
  selector: 'ish-mini-cart-container',
  templateUrl: './mini-cart.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniCartContainerComponent implements OnInit {
  basket$: Observable<Basket>;
  region$: Observable<Region>;

  constructor(private store: Store<CheckoutState>) {}

  ngOnInit() {
    this.basket$ = this.store.pipe(select(getCurrentBasket));
  }
}
