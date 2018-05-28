import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Product } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-inventory',
  templateUrl: './product-inventory.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductInventoryComponent {
  @Input() product: Product;
}
