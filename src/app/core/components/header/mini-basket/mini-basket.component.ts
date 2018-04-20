import { animate, AnimationBuilder, style } from '@angular/animations';
import { ChangeDetectionStrategy, Component, ElementRef, Input, OnChanges, ViewChild } from '@angular/core';
import { Basket, BasketHelper } from '../../../../models/basket/basket.model';
import { ProductHelper } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-mini-basket',
  templateUrl: './mini-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MiniBasketComponent implements OnChanges {
  @Input() basket: Basket;
  @ViewChild('slider') slider: ElementRef;

  readonly ANIMATION_TIMING: string = '200ms ease-in';

  generateProductRoute = ProductHelper.generateProductRoute;

  isCollapsed = true;
  itemCount = 0;
  currentProduct = 0;

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
    const tileHeight = slider.children.length > 0 ? slider.children.item(0).clientHeight : 0;

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
    const tileHeight = slider.children.length > 0 ? slider.children.item(0).clientHeight : 0;
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
      animate(this.ANIMATION_TIMING, style({ transform: `translateY(-${offset}px)` })),
    ]);

    const player = scrollAnimation.create(slider);
    player.play();
  }
}
