import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Category } from 'ish-core/models/category/category.model';
import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';
import { Product } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-product-tile',
  templateUrl: './product-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTileComponent {
  @Input() product: Product;
  @Input() variationOptions: VariationOptionGroup[];
  @Input() category: Category;
  @Input() isInCompareList: boolean;
  @Output() compareToggle = new EventEmitter<void>();
  @Output() productToBasket = new EventEmitter<void>();

  toggleCompare() {
    this.compareToggle.emit();
  }

  addToBasket() {
    this.productToBasket.emit();
  }
}
