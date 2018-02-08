import { Component, Input } from '@angular/core';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-inventory',
  templateUrl: './product-inventory.component.html'
})
export class ProductInventoryComponent {

  @Input() product: Product;

}
