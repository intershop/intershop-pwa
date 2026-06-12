import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Displays paging information for robots.
 *
 * @example
 * @if (displayPaging$ | async) {
 *   <ish-product-list-paging
 *     [currentPage]="currentPage$ | async"
 *     [pageIndices]="pageIndices$ | async"
 *   />
 * }
 */
@Component({
  selector: 'ish-product-list-paging',
  templateUrl: './product-list-paging.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListPagingComponent {
  @Input({ required: true }) currentPage: number;
  @Input({ required: true }) pageIndices: { value: number; display: string }[];
  @Input() fragmentOnRouting: string;
}
