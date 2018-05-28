import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Price, PriceHelper } from '../../../../models/price/price.model';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-price',
  templateUrl: './product-price.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPriceComponent implements OnChanges {
  @Input() product: Product;
  @Input() showInformationalPrice: boolean;
  @Input() showPriceSavings: boolean;

  isListPriceGreaterThanSalePrice = false;
  isListPriceLessThanSalePrice = false;
  priceSavings: Price;

  ngOnChanges() {
    if (this.product.listPrice && this.product.salePrice) {
      this.isListPriceGreaterThanSalePrice = this.product.listPrice.value > this.product.salePrice.value;
      this.isListPriceLessThanSalePrice = this.product.listPrice.value < this.product.salePrice.value;
      if (this.showPriceSavings) {
        this.priceSavings = PriceHelper.diff(this.product.listPrice, this.product.salePrice);
      }
    }
  }
}
