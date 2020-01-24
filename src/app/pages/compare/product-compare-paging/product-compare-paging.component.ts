import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

/**
 * The Product Compare Paging Component
 *
 * Handles the pagging within the table of compared products in the {@link ProductCompareListComponent}.
 *
 * @example
 * <ish-product-compare-paging
 *               [totalItems]="compareProducts.length"
 *               [itemsPerPage]="itemsPerPage"
 *               [currentPage]="currentPage"
 *               (changePage)="changeCurrentPage($event)"
 * ></ish-product-compare-paging>
 */
@Component({
  selector: 'ish-product-compare-paging',
  templateUrl: './product-compare-paging.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductComparePagingComponent implements OnChanges {
  /**
   * The total items number to be considered for paging
   */
  @Input() totalItems: number;

  /**
   * The maximum number of items that should be displayed on one page
   */
  @Input() itemsPerPage: number;

  /**
   * The current page number
   */
  @Input() currentPage: number;

  /**
   * Trigger an event to change the page to the given page number
   */
  @Output() changePage = new EventEmitter<number>();

  showNext = false;
  showPrevious = false;

  ngOnChanges() {
    // determine whether to show next button
    this.showNext = (Math.ceil(this.totalItems / this.itemsPerPage) || 0) !== this.currentPage;
    // determine whether to show previous button
    this.showPrevious = 1 !== this.currentPage;
  }

  /**
   * Change the paging to the given page number.
   * @param pageNumber The page number to change to
   */
  changeToPage(pageNumber: number) {
    this.changePage.emit(pageNumber);
  }
}
