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

export interface ProductTileComponentConfiguration {
  readOnly(p: Product): boolean;
  displayName(p: Product): boolean;
  displayVariations(p: Product): boolean;
  displayPrice(p: Product): boolean;
  displayPromotions(p: Product): boolean;
  displayAddToBasket(p: Product): boolean;
  displayAddToCompare(p: Product): boolean;
  displayAddToQuote(p: Product): boolean;
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
  @Input() category: Category;
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

  is(property: keyof ProductTileComponentConfiguration): boolean {
    return this.configuration[property] && this.configuration[property](this.product);
  }
}
