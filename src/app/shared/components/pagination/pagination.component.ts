import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Pagination } from '../../../models/pagination/pagination.interface';

@Component({
  selector: 'ish-pagination',
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  @Input() totalItems: number;
  @Input() itemsPerPage: number;
  @Output() pageChanged = new EventEmitter<Pagination>();
  currentPage = 1;

  /**
   * select page handle next or previous button click
   * @param  {number} currentPage
   * @returns void
   */
  selectPage(currentPage: number): void {
    this.pageChanged.emit({
      currentPage: this.currentPage = currentPage,
      itemsPerPage: this.itemsPerPage
    });
  }

  /**
   * Determine whether to show next button
   * @returns boolean
   */
  isShowNext(): boolean {
    const totalPages = Math.ceil(this.totalItems / this.itemsPerPage) || 0;
    return totalPages !== this.currentPage;
  }

  /**
   * Determine whether to show previous button
   * @returns boolean
   */
  isShowPrevious(): boolean {
    return (1 !== this.currentPage);
  }

}
