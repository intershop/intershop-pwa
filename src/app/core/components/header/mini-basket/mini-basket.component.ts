import { animate, AnimationBuilder, style } from '@angular/animations';
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { Basket, BasketHelper } from '../../../../models/basket/basket.model';
import { ProductHelper } from '../../../../models/product/product.model';

/**
 * The Mini Basket Component displays a quick overview over the users basket items
 * It uses the {@link ProductImageComponent} for the rendering of product images.
 *
 * @example
 * <ish-mini-basket [basket]="basket$ | async"></ish-mini-basket>
 */
@Component({
  selector: 'ish-mini-basket',
  templateUrl: './mini-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniBasketComponent implements OnChanges {
  /**
   * the basket that should be displayed
   */
  @Input() basket: Basket;

  /**
   * vertical product slider element reference
   */
  @ViewChild('slider') slider: ElementRef;

  isCollapsed = true;
  itemCount = 0;
  currentProduct = 0;

  generateProductRoute = ProductHelper.generateProductRoute;

  constructor(private animationBuilder: AnimationBuilder) {}

  ngOnChanges() {
    if (this.basket) {
      this.itemCount = BasketHelper.getBasketItemsCount(this.basket);
    }
  }

  /**
   * Slider control scroll up.
   */
  scrollUp() {
    if (!this.slider || this.currentProduct === 0) {
      return;
    }

    const slider = this.slider.nativeElement as HTMLDivElement;
    const tileHeight = slider.children.length > 0 ? slider.lastElementChild.getBoundingClientRect().height : 0;

    this.currentProduct -= 1;
    const offset = tileHeight * this.currentProduct;
    this.animate(offset);
  }

  /**
   * Slider control scroll down.
   */
  scrollDown() {
    if (!this.slider || !this.basket || !this.basket.lineItems) {
      return;
    }

    const slider = this.slider.nativeElement as HTMLDivElement;
    const tileHeight = slider.children.length > 0 ? slider.lastElementChild.getBoundingClientRect().height : 0;
    if (this.currentProduct < this.basket.lineItems.length - 2) {
      this.currentProduct += 1;
      const offset = tileHeight * this.currentProduct;
      this.animate(offset);
    }
  }

  /**
   * Animate the slider container.
   * @param offset vertical translate offset
   */
  animate(offset: number) {
    if (!this.slider) {
      return;
    }

    const slider = this.slider.nativeElement as HTMLDivElement;
    const scrollAnimation = this.animationBuilder.build([
      animate('200ms ease-in', style({ transform: `translateY(-${offset}px)` })),
    ]);

    const player = scrollAnimation.create(slider);
    player.play();
  }
}
