import { Component, Input } from '@angular/core';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-detail',
  templateUrl: './product-detail.component.html'
})

export class ProductDetailComponent {

  @Input() product: Product;

}
