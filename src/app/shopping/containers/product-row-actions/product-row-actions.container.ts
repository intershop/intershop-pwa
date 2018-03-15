import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Product } from '../../../models/product/product.model';

@Component({
  selector: 'ish-product-row-actions-container',
  templateUrl: './product-row-actions.container.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductRowActionsContainerComponent {

  @Input() product: Product;

  addToCart() {
    console.log('[ProductRowActionsContainer] Add to Cart: SKU: ' + this.product.sku + ', Quantity: ' + this.product.minOrderQuantity);
    // TODO: dispatch add to cart action // this.store.dispatch(new AddToCart(this.product.sku, this.product.minOrderQuantity));
  }

}
