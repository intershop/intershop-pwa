import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Product } from 'ish-core/models/product/product.model';

/**
 * The Product ID Component renders the product id with a label.
 *
 * @example
 * <ish-product-id [product]="product"></ish-product-id>
 */
@Component({
  selector: 'ish-product-id',
  templateUrl: './product-id.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductIdComponent {
  /**
   * The product for which the ID should be displayed.
   */
  @Input() product: Product;
}
