// NEEDS_WORK: DUMMY COMPONENT
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'ish-mini-cart',
  templateUrl: './mini-cart.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class MiniCartComponent implements OnChanges {

  @Input() cartItems: { salePrice: { value: number } }[];

  isCollapsed = true;
  cartPrice: number;
  cartLength: number;

  ngOnChanges() {
    this.cartPrice = 0;
    this.cartLength = 0;
    if (this.cartItems && this.cartItems.length) {
      this.cartPrice = this.cartItems.map(item => item.salePrice.value).reduce((l, r) => l + r, 0);
      this.cartLength = this.cartItems.length;
    }
  }
}
