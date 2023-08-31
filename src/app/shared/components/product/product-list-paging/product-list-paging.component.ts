import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Displays paging information for robots.
 *
 * @example
 *  <ish-product-list-paging *ngIf="displayPaging$ | async"
 *    [currentPage]="currentPage$ | async"
 *    [pageIndices]="pageIndices$ | async"
 *  ></ish-product-list-paging>
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
