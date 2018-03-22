import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Category } from '../../../../models/category/category.model';
import { Product, ProductHelper } from '../../../../models/product/product.model';

@Component({
  selector: 'ish-product-row',
  templateUrl: './product-row.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductRowComponent {

  @Input() product: Product;
  @Input() category?: Category;

  generateProductRoute = ProductHelper.generateProductRoute;

}
