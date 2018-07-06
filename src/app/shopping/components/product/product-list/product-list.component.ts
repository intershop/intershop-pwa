import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Category } from '../../../../models/category/category.model';
import { Product } from '../../../../models/product/product.model';
import { ViewType } from '../../../../models/viewtype/viewtype.types';

/**
 * The Product List Component displays a list of products emits an event when the user scrolled to the bottom and more products have to be loaded.
 *
 * @example
 * <ish-product-list
 *               [products]="products$ | async"
 *               [category]="category$ | async"
 *               [viewType]="viewType$ | async"
 *               (loadMore)="loadMoreProducts()"
 * ></ish-product-list>
 */
@Component({
  selector: 'ish-product-list',
  templateUrl: './product-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  @Input() products: Product[];
  @Input() category?: Category;
  @Input() viewType?: ViewType = 'grid';

  @Output() loadMore = new EventEmitter<void>();
}
