import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';

import { BasketView } from 'ish-core/models/basket/basket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

/**
 * The Mini Basket Component displays a quick overview over the users basket items.
 * It uses the {@link ProductImageComponent} for the rendering of product images.
 *
 * @example
 * <ish-mini-basket
      [basket]="basket$ | async"
      [view]="view"
      [basketAnimation]="basketAnimation$ | async"
      [error]="basketError$ | async"
    ></ish-mini-basket>
 */
@Component({
  selector: 'ish-mini-basket',
  templateUrl: './mini-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniBasketComponent implements OnChanges {
  /**
   * The basket that should be displayed.
   */
  @Input() basket: BasketView;
  @Input() view: 'auto' | 'small' | 'full' = 'auto';
  @Input() basketAnimation = '';
  @Input() error: HttpError;

  isCollapsed = true;
  itemCount = 0;

  constructor(private location: Location) {}

  ngOnChanges(c: SimpleChanges) {
    this.animateBasket(c);
    if (this.basket) {
      this.itemCount = this.basket.totalProductQuantity;
    } else {
      this.itemCount = 0;
    }
  }

  /**
   * Animate basket after the product line item count has changed
   * Open basket if an error occured
   */
  animateBasket(c: SimpleChanges) {
    if (c && c.basketAnimation && this.location.path() !== '/basket') {
      if (this.basketAnimation && c.basketAnimation.currentValue === 'tada') {
        this.open();
      } else {
        this.collapse();
      }
    }
    if (c && !!c.error && this.error) {
      this.open();
    }
  }

  /**
   * Toggle the collapse state of the mini basket programmatically.
   */
  toggleCollapse() {
    this.isCollapsed = !this.isCollapsed;
  }

  /**
   * Collapse the mini basket programmatically.
   */
  collapse() {
    this.isCollapsed = true;
  }

  /**
   * Open the mini basket programmatically.
   */
  open() {
    this.isCollapsed = false;
  }
}
