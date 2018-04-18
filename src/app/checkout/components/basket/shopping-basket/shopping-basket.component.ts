import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Basket } from '../../../../models/basket/basket.model';

@Component({
  selector: 'ish-shopping-basket',
  templateUrl: './shopping-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShoppingBasketComponent implements OnInit {
  @Input() basket: Basket;

  ngOnInit() {
    if (!this.basket) {
      throw new Error('required input parameter <basket> is missing for BasketComponent');
    }
  }
}
