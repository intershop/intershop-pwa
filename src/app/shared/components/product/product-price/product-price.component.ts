import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { Price, PriceHelper } from 'ish-core/models/price/price.model';
import { ProductPrices } from 'ish-core/models/product/product.model';

@Component({
  selector: 'ish-product-price',
  templateUrl: './product-price.component.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ProductPriceComponent implements OnChanges {
  @Input() product: ProductPrices;
  @Input() showInformationalPrice: boolean;
  @Input() showPriceSavings: boolean;

  isListPriceGreaterThanSalePrice = false;
  isListPriceLessThanSalePrice = false;
  priceSavings: Price;

  ngOnChanges() {
    this.applyPriceParameters(this.product);
  }

  private applyPriceParameters(product: ProductPrices) {
    if (product.listPrice && product.salePrice) {
      this.isListPriceGreaterThanSalePrice = product.listPrice.value > product.salePrice.value;
      this.isListPriceLessThanSalePrice = product.listPrice.value < product.salePrice.value;
      if (this.showPriceSavings) {
        this.priceSavings = PriceHelper.diff(product.listPrice, product.salePrice);
      }
    }
  }

  get upperPrice() {
    return this.product.summedUpSalePrice || this.product.maxSalePrice;
  }

  get isPriceRange() {
    return this.product.minSalePrice && this.upperPrice;
  }
}
