import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
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

  ngOnInit() {
    this.basket$ = of({
      id: '123',
      lineItems: [
        {
          name: 'product 1',
          quantity: {
            value: 60,
          },
        },
        {
          name: 'product 2',
          quantity: {
            value: 40,
          },
        },
      ],
      totals: {
        basketTotal: {
          value: 8989,
          currencyMnemonic: 'USD',
        },
      },
    } as Basket);
  }
}
