import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Category } from '../../../../models/category/category.model';
import { Product } from '../../../../models/product/product.model';
import { ViewType } from '../../../../models/viewtype/viewtype.types';

@Component({
  selector: 'ish-product-list',
  templateUrl: './product-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class ProductListComponent {

  @Input() products: Product[];
  @Input() category?: Category;
  @Input() viewType?: ViewType = 'grid';

}
