import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { Price, PriceHelper } from 'ish-core/models/price/price.model';
import { ProductRetailSet } from 'ish-core/models/product/product-retail-set.model';
import { VariationProductMaster } from 'ish-core/models/product/product-variation-master.model';
import { Product } from 'ish-core/models/product/product.model';

declare type PricesOfProducts = Partial<
  Pick<Product, 'salePrice' | 'listPrice'> &
    Pick<ProductRetailSet, 'summedUpSalePrice'> &
    Pick<VariationProductMaster, 'minSalePrice' | 'maxSalePrice'>
>;

@Component({
  selector: 'ish-product-price',
  templateUrl: './product-price.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPriceComponent implements OnChanges {
  @Input() product: PricesOfProducts;
  @Input() showInformationalPrice: boolean;
  @Input() showPriceSavings: boolean;

  isListPriceGreaterThanSalePrice = false;
  isListPriceLessThanSalePrice = false;
  priceSavings: Price;

  ngOnChanges() {
    this.applyPriceParameters(this.product);
  }

  private applyPriceParameters(product: PricesOfProducts) {
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
