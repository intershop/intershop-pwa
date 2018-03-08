import { Component, Input } from '@angular/core';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-compare-list',
  templateUrl: './product-compare-list.component.html'
})
export class ProductCompareListComponent {

  @Input() compareProducts: Product[] = [];

}
