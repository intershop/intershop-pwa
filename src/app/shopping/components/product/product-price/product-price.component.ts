import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { Price, PriceHelper } from '../../../../models/price/price.model';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-price',
  templateUrl: './product-price.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPriceComponent implements OnChanges {
  @Input()
  product: Product;
  @Input()
  showInformationalPrice: boolean;
  @Input()
  showPriceSavings: boolean;

  isListPriceGreaterThanSalePrice = false;
  isListPriceLessThanSalePrice = false;
  priceSavings: Price;

  ngOnChanges() {
    this.applyPriceParameters(this.product);
  }

  private applyPriceParameters(product: Product) {
    if (product.listPrice && product.salePrice) {
      this.isListPriceGreaterThanSalePrice = product.listPrice.value > product.salePrice.value;
      this.isListPriceLessThanSalePrice = product.listPrice.value < product.salePrice.value;
      if (this.showPriceSavings) {
        this.priceSavings = PriceHelper.diff(product.listPrice, product.salePrice);
      }
    }
  }
}
