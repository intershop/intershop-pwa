import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../../../models/product/product.model';
import { ViewType } from '../../../../models/viewtype/viewtype.types';

/**
 * The Search Result Component displays a list of products as the result of a search and emits events for changing view type or sorting of the list.
 * It uses the {@link ProductListToolbarComponent} to provide list actions and {@link ProductListComponent} for the product list.
 *
 * @example
 * <ish-search-result
 *               [searchTerm]="searchTerm"
 *               [products]="products"
 *               [totalItems]="totalItems$ | async"
 *               [viewType]="viewType$ | async"
 *               [sortBy]="sortBy$ | async"
 *               [sortKeys]="sortKeys$ | async"
 *               (viewTypeChange)="changeViewType($event)"
 *               (sortByChange)="changeSortBy($event)"
 * ></ish-search-result>
 */
@Component({
  selector: 'ish-search-result',
  templateUrl: './search-result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultComponent {
  /**
   * The the search term leading to the displayed result.
   */
  @Input()
  searchTerm: string;

  /**
   * The list of products as the result of a search (with paging applied if necessary).
   */
  @Input()
  products: Product[];

  /**
   * The total number of product search results (might be different from products.length if paging is applied).
   */
  @Input()
  totalItems: number;

  /**
   * The view type for the product list, values are 'grid' [default] or 'list'.
   */
  @Input()
  viewType: ViewType;

  /**
   * The value that is used to sort the product list.
   */
  @Input()
  sortBy: string;

  /**
   * The list of available sortings to sort the product list.
   */
  @Input()
  sortKeys: string[];

  /**
   * Event for switching the view type of the product list.
   */
  @Output()
  viewTypeChange = new EventEmitter<string>();

  /**
   * Event for changing the sorting of the product list.
   */
  @Output()
  sortByChange = new EventEmitter<string>();

  @Input()
  loadingMore: boolean;

  @Output()
  loadMore = new EventEmitter<void>();

  /**
   * Emits the event for switching the view type of the product list.
   * @param viewType The new view type.
   */
  changeViewType(viewType: ViewType) {
    this.viewTypeChange.emit(viewType);
  }

  /**
   * Emits the event for changing the sorting of the product list.
   * @param sortBy The new sorting value.
   */
  changeSortBy(sortBy: string) {
    this.sortByChange.emit(sortBy);
  }
}
