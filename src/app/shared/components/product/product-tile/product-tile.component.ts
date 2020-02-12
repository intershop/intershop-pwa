import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.model';

export interface ProductTileComponentConfiguration {
  readOnly: boolean;
  displayName: boolean;
  displayVariations: boolean;
  displayPrice: boolean;
  displayPromotions: boolean;
  displayAddToBasket: boolean;
  displayAddToCompare: boolean;
  displayAddToQuote: boolean;
}

@Component({
  selector: 'ish-product-tile',
  templateUrl: './product-tile.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductTileComponent {
  @Input() configuration: Partial<ProductTileComponentConfiguration> = {};
  @Input() product: ProductView | VariationProductView | VariationProductMasterView;
  @Input() quantity: number;
  @Input() variationOptions: VariationOptionGroup[];
  @Input() category: CategoryView;
  @Input() isInCompareList: boolean;
  @Output() compareToggle = new EventEmitter<void>();
  @Output() productToBasket = new EventEmitter<number>();
  @Output() selectVariation = new EventEmitter<VariationSelection>();

  isMasterProduct = ProductHelper.isMasterProduct;

  addToBasket() {
    this.productToBasket.emit(this.quantity || this.product.minOrderQuantity);
  }

  toggleCompare() {
    this.compareToggle.emit();
  }

  variationSelected(selection: VariationSelection) {
    this.selectVariation.emit(selection);
  }

  get variationCount() {
    return (
      this.product &&
      ProductHelper.isMasterProduct(this.product) &&
      this.product.variations() &&
      this.product.variations().length
    );
  }
}
