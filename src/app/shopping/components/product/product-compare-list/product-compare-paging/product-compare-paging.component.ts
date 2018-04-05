import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ish-product-compare-paging',
  templateUrl: './product-compare-paging.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductComparePagingComponent {
  @Input() totalItems: number;
  @Input() itemsPerPage: number;
  @Input() currentPage: number;
  @Output() pageChanged = new EventEmitter<number>();

  /**
   * select page handle next or previous button click
   * @param currentPage
   */
  selectPage(currentPage: number) {
    this.pageChanged.emit(currentPage);
  }

  /**
   * Determine whether to show next button
   * @returns
   */
  isShowNext(): boolean {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage) || 0;
    return totalPages !== this.currentPage;
  }

  /**
   * Determine whether to show previous button
   * @returns
   */
  isShowPrevious(): boolean {
    return (1 !== this.currentPage);
  }

}
