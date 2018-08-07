import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * The Search Result Component displays a list of products as the result of a search and emits events for changing view type or sorting of the list.
 * It uses the {@link ProductListToolbarComponent} to provide list actions and {@link ProductListComponent} for the product list.
 *
 * @example
 * <ish-search-result
 *               [searchTerm]="searchTerm"
 *               [totalItems]="totalItems$ | async"
 *               (loadMore)="loadMore.emit()"
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
   * The total number of product search results (might be different from products.length if paging is applied).
   */
  @Input()
  totalItems: number;

  /**
   * Request from the product-list to retrieve more products.
   */
  @Output()
  loadMore = new EventEmitter<void>();
}
