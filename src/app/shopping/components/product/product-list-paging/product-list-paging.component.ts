import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Displays paging information for robots.
 *
 * @example
 *  <ish-product-list-paging *ngIf="displayPaging$ | async"
 *    [currentPage]="currentPage$ | async"
 *    [pageIndices]="pageIndices$ | async"
 *    [pageUrl]="pageUrl"
 *  ></ish-product-list-paging>
 */
@Component({
  selector: 'ish-product-list-paging',
  templateUrl: './product-list-paging.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListPagingComponent {
  @Input()
  currentPage: number;
  @Input()
  canRequestMore: boolean;
  @Input()
  pageIndices: number[];
  @Input()
  pageUrl: string;

  /**
   * Generates a paging URL for the given page number with the current page URL
   * @param pageNumber The page number to generate the URL for
   */
  generatePagingUrl(pageNumber: number): string {
    return `${this.pageUrl}?page=${pageNumber}`;
  }
}
