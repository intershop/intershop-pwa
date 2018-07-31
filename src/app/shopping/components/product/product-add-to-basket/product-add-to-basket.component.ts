import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-add-to-basket',
  templateUrl: './product-add-to-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductAddToBasketComponent {
  @Input()
  product: Product;
  @Input()
  disabled = false;
  @Input()
  displayType?: string;
  @Input()
  class?: string;
  @Output()
  productToBasket = new EventEmitter<void>();

  addToBasket() {
    this.productToBasket.emit();
  }
}
