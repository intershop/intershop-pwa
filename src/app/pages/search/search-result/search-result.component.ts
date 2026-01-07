import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { NgbCollapse } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { IconModule } from 'ish-core/icon.module';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';
import { SkipContentLinkComponent } from 'ish-shared/components/common/skip-content-link/skip-content-link.component';
import { FilterNavigationComponent } from 'ish-shared/components/filter/filter-navigation/filter-navigation.component';
import { ProductListingComponent } from 'ish-shared/components/product/product-listing/product-listing.component';

/**
 * The Search Result Component displays a list of products as the result of a search and emits events for changing view type or sorting of the list.
 * It uses the {@link ProductListToolbarComponent} to provide list actions and {@link ProductListComponent} for the product list.
 *
 * @example
 * <ish-search-result [searchTerm]="searchTerm" />
 */
@Component({
  selector: 'ish-search-result',
  templateUrl: './search-result.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ContentIncludeComponent,
    SkipContentLinkComponent,
    FilterNavigationComponent,
    NgbCollapse,
    TranslateModule,
    IconModule,
    BreadcrumbComponent,
    ProductListingComponent,
  ],
})
export class SearchResultComponent implements OnInit, OnChanges {
  /**
   * The the search term leading to the displayed result.
   */
  @Input({ required: true }) searchTerm: string;

  /**
   * The total number of product search results (optional, might be different from products.length if paging is applied).
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
