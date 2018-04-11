import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Category } from '../../../models/category/category.model';
import { Product } from '../../../models/product/product.model';

@Component({
  selector: 'ish-product-row-container',
  templateUrl: './product-row.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductRowContainerComponent {
  @Input() product: Product;
  @Input() category?: Category;

  addToCart() {
    console.log(
      '[ProductRowContainer] Add to Cart: SKU: ' + this.product.sku + ', Quantity: ' + this.product.minOrderQuantity
    );
    // TODO: dispatch add to cart action // this.store.dispatch(new AddToCart(this.product.sku, this.product.minOrderQuantity));
  }
}
