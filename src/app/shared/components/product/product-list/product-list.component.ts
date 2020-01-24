import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Category } from 'ish-core/models/category/category.model';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';

/**
 * The Product List Component displays a list of products.
 *
 * @example
 * <ish-product-list
 *               [products]="products$ | async"
 *               [category]="category$ | async"
 *               [viewType]="viewType$ | async"
 * ></ish-product-list>
 */
@Component({
  selector: 'ish-product-list',
  templateUrl: './product-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  @Input() products: string[];
  @Input() category?: Category;
  @Input() viewType?: ViewType = 'grid';

  get isList() {
    return this.viewType === 'list';
  }

  get isGrid() {
    return !this.isList;
  }
}
