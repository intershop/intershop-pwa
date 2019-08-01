import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Category } from 'ish-core/models/category/category.model';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';

/**
 * The Product List Component displays a list of products emits an event when the user scrolled to the bottom and more products have to be loaded.
 *
 * @example
 * <ish-product-list
 *               [products]="products$ | async"
 *               [category]="category$ | async"
 *               [viewType]="viewType$ | async"
 *               (loadMore)="loadMoreProducts()"
 *               (selectVariation)="variationSelected($event)"
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
  @Input() loadingMore: boolean;

  @Output() loadMore = new EventEmitter<'up' | 'down'>();

  get isGrid() {
    return this.viewType === 'grid';
  }

  get isList() {
    return this.viewType === 'list';
  }
}
