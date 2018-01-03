import { Component, Input } from '@angular/core';
import { Product } from '../../../../models/product.model';

@Component({
  selector: 'ish-product-price',
  templateUrl: './product-price.component.html'
})

export class ProductPriceComponent {

  @Input() product: Product;

  constructor() { }

}
