import { Component, Input, OnInit } from '@angular/core';
import { Price } from '../../../../models/price/price.model';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-price',
  templateUrl: './product-price.component.html'
})

export class ProductPriceComponent implements OnInit {
  @Input() showInformationalPrice: boolean;
  @Input() showPriceSavings: boolean;
  @Input() product: Product;
  salePrice: Price;
  listPrice: Price;

  ngOnInit() {
    this.salePrice = this.product.salePrice;
    this.listPrice = this.product.listPrice;
  }
}
