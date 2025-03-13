import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ish-pagination',
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  @Input() pageSize = 25;
  @Input() pageNumber = 1;
  @Input() totalItems = 1;
  @Output() pageChanged = new EventEmitter<{ page: number; pageSize: number }>();

  gotoPage(page: number) {
    this.pageChanged.emit({ page, pageSize: this.pageSize });
  }

  morePages() {
    return this.pageNumber < Math.ceil(this.totalItems / this.pageSize);
  }
}
