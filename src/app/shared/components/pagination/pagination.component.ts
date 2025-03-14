import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'ish-pagination',
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent implements OnChanges {
  numPages = 1;
  @Input() pageSize = 25;
  @Input() pageNumber = 1;
  @Input() totalItems = 1;
  @Output() pageChanged = new EventEmitter<{ page: number; pageSize: number }>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.totalItems) {
      this.numPages = Math.ceil(this.totalItems / this.pageSize);
    }
  }

  gotoPage(page: number) {
    this.pageChanged.emit({ page, pageSize: this.pageSize });
  }

  generatePagination(currentPage: number, totalPages: number): (number | string)[] {
    const pages: (number | string)[] = [];
    const addPage = (page: number | string) => {
      if (pages[pages.length - 1] !== page) {
        pages.push(page);
      }
    };

    addPage(1);
    if (currentPage > 3) {
      addPage('...');
    }
    for (let page = Math.max(2, currentPage - 1); page <= Math.min(totalPages - 1, currentPage + 1); page++) {
      addPage(page);
    }
    if (currentPage < totalPages - 2) {
      addPage('...');
    }
    addPage(totalPages);

    return pages;
  }
}
