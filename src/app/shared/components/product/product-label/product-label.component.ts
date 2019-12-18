import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';

/**
 * The Product Label Component renders a label for a product with label information, i.a. new, sale or topseller.
 *
 * @example
 * <ish-product-label [product]="product"></ish-product-label>
 */
@Component({
  selector: 'ish-product-label',
  templateUrl: './product-label.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductLabelComponent implements OnChanges {
  /**
   * The product for which the label should be displayed
   */
  @Input() product: Product;

  productLabel: string;

  ngOnChanges() {
    this.determineProductLabel();
  }

  /**
   * Determines if a product has product label information assigned to it
   * by evaluating the ProductLabelAttributes of the product
   * and setting the first one found if any exists.
   */
  determineProductLabel() {
    if (ProductHelper.getAttributesOfGroup(this.product, AttributeGroupTypes.ProductLabelAttributes)) {
      this.productLabel = ProductHelper.getAttributesOfGroup(
        this.product,
        AttributeGroupTypes.ProductLabelAttributes
      )[0].name;
    }
  }
}
