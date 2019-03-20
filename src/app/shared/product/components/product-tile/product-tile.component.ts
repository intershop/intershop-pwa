import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Category } from 'ish-core/models/category/category.model';
import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-product-tile',
  templateUrl: './product-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTileComponent {
  @Input() product: ProductView | VariationProductView | VariationProductMasterView;
  @Input() variationOptions: VariationOptionGroup[];
  @Input() category: Category;
  @Input() isInCompareList: boolean;
  @Output() compareToggle = new EventEmitter<void>();
  @Output() productToBasket = new EventEmitter<void>();
  @Output() selectVariation = new EventEmitter<{ selection: VariationSelection; product: VariationProductView }>();

  toggleCompare() {
    this.compareToggle.emit();
  }

  addToBasket() {
    this.productToBasket.emit();
  }

  variationSelected(selection: VariationSelection) {
    if (ProductHelper.isVariationProduct(this.product)) {
      this.selectVariation.emit({ selection, product: this.product });
    }
  }
}
