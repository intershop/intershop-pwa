import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';

import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

/**
 * The Search Result Component displays a list of products as the result of a search and emits events for changing view type or sorting of the list.
 * It uses the {@link ProductListToolbarComponent} to provide list actions and {@link ProductListComponent} for the product list.
 *
 * @example
 * <ish-search-result
 *               [searchTerm]="searchTerm"
 *               [totalItems]="totalItems$ | async"
 * ></ish-search-result>
 */
@Component({
  selector: 'ish-search-result',
  templateUrl: './search-result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultComponent implements OnInit, OnChanges {
  /**
   * The the search term leading to the displayed result.
   */
  @Input() searchTerm: string;

  /**
   * The total number of product search results (might be different from products.length if paging is applied).
   */
  @Input() totalItems: number;
  @Input() deviceType: DeviceType;

  isCollapsed = false;

  ngOnInit() {
    this.isCollapsed = this.deviceType === 'mobile';
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!SSR) {
      window.scroll(0, 0);
    }
    if (changes.deviceType) {
      this.isCollapsed = this.deviceType === 'mobile';
    }
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
    if (!SSR) {
      window.scroll(0, 0);
    }
  }
}
