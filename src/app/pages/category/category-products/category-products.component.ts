import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';
import { SkipContentLinkComponent } from 'ish-shared/components/common/skip-content-link/skip-content-link.component';
import { FilterNavigationComponent } from 'ish-shared/components/filter/filter-navigation/filter-navigation.component';
import { ProductListingComponent } from 'ish-shared/components/product/product-listing/product-listing.component';

import { CategoryNavigationComponent } from '../category-navigation/category-navigation.component';

@Component({
  selector: 'ish-category-products',
  templateUrl: './category-products.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    SkipContentLinkComponent,
    CategoryNavigationComponent,
    NgbCollapseModule,
    TranslatePipe,
    FilterNavigationComponent,
    BreadcrumbComponent,
    ProductListingComponent,
  ],
})
export class CategoryProductsComponent implements OnInit, OnChanges {
  /**
   * The the category leading to the displayed result.
   */
  @Input({ required: true }) category: CategoryView;
  @Input() deviceType: DeviceType;

  isCollapsed = true;

  ngOnInit() {
    this.isCollapsed = this.deviceType === 'mobile';
  }

  ngOnChanges() {
    if (!SSR) {
      window.scroll(0, 0);
    }
    this.isCollapsed = this.deviceType === 'mobile';
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
    if (!SSR) {
      window.scroll(0, 0);
    }
  }
}
