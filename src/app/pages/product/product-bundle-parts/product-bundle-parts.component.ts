import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { ProductBundle } from 'ish-core/models/product/product-bundle.model';
import { ProductItemContainerConfiguration } from 'ish-shared/components/product/product-item/product-item.component';

@Component({
  selector: 'ish-product-bundle-parts',
  templateUrl: './product-bundle-parts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductBundlePartsComponent {
  @Input() product: ProductBundle;

  @Output() productToBasket = new EventEmitter();

  productRowConfiguration: Partial<ProductItemContainerConfiguration> = {
    quantityLabel: 'product.quantity.label',
    displayType: 'row',
    readOnly: () => true,
    displayPrice: () => false,
    displayInventory: () => false,
    displayPromotions: () => false,
    displayAddToBasket: () => false,
    displayAddToQuote: () => false,
    displayAddToCompare: () => false,
  };
}
