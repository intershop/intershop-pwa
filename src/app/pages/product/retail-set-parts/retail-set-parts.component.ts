import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { ProductRetailSet } from 'ish-core/models/product/product-retail-set.model';
import { SkuQuantityType } from 'ish-core/models/product/product.model';
import { ProductItemContainerConfiguration } from 'ish-shared/components/product/product-item/product-item.component';

type DisplayType = 'tile' | 'row';

@Component({
  selector: 'ish-retail-set-parts',
  templateUrl: './retail-set-parts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RetailSetPartsComponent {
  @Input() product: ProductRetailSet;
  @Input() parts: SkuQuantityType[];
  @Output() partsChange = new EventEmitter<SkuQuantityType[]>();
  @Input() displayType?: DisplayType = 'row';
  @Output() productToBasket = new EventEmitter<void>();

  productTileConfiguration: Partial<ProductItemContainerConfiguration> = {
    displayType: 'tile',
    displayAddToCompare: () => false,
    displayAddToQuote: () => false,
  };

  productRowConfiguration: Partial<ProductItemContainerConfiguration> = {
    allowZeroQuantity: true,
    displayType: 'row',
    displayAddToCompare: () => false,
    displayAddToQuote: () => false,
    displayShipment: () => true,
  };

  /**
   * accumulate changes from product item containers and emit the complete current retail set
   */
  productChange(idx: number, sku: string, quantity?: number) {
    const newParts = [...this.parts];
    newParts.splice(idx, 1, { sku, quantity: typeof quantity === 'number' ? quantity : this.parts[idx].quantity });
    this.partsChange.emit(newParts);
  }

  trackByFn(idx) {
    return idx;
  }
}
