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
    console.log('[ProductRowActionsContainer] Add ' + this.product.name + ' to Cart');
  }

}
