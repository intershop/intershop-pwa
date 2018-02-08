import { Component, Input } from '@angular/core';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-price',
  templateUrl: './product-price.component.html'
})

export class ProductPriceComponent {

  @Input() product: Product;
  @Input() showInformationalPrice: boolean;
  @Input() showPriceSavings: boolean;

  isListPriceGreaterThanSalePrice(): boolean {
    return this.product.listPrice && this.product.salePrice && this.product.listPrice.value > this.product.salePrice.value;
  }

  isListPriceLessThanSalePrice(): boolean {
    return this.product.listPrice && this.product.salePrice && this.product.listPrice.value < this.product.salePrice.value;
  }
}
