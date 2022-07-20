import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'ish-paging',
  templateUrl: './paging.component.html',
  styleUrls: ['./paging.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PagingComponent implements OnChanges {
  @Input() currentPage: number;
  @Input() lastPage: number;

  @Output() goToPage: EventEmitter<number> = new EventEmitter<number>();

  pageIndices: number[] = [];

  ngOnChanges(): void {
    if (this.currentPage && this.lastPage) {
      this.pageIndices = this.getPages(this.currentPage, this.lastPage);
    }
  }
  /**
   * If the user changes the page the goToPage event is emitted
   *
   * @param page : changed page number
   */
  setPage(page: number) {
    this.goToPage.emit(page);
  }

  /**
   * Determines the page array - elements with the value of -1 will be shown as ...
   *
   * @param current current page
   * @param total   number of pages
   * @returns       pages array
   */
  private getPages(current: number, total: number): number[] {
    if (total <= 8) {
      return [...Array(total).keys()].map(x => x + 1);
    }

    if (current > 4) {
      if (current >= total - 3) {
        return [1, -1, total - 5, total - 4, total - 3, total - 2, total - 1, total];
      } else {
        return [1, -1, current - 2, current - 1, current, current + 1, current + 2, -1, total];
      }
    }

    return [1, 2, 3, 4, 5, 6, -1, total];
  }
}
