import { NgModule } from '@angular/core';

import { FormsSharedModule } from '../forms/forms-shared.module';
import { QuotingSharedModule } from '../quoting/quoting-shared.module';
import { SharedModule } from '../shared/shared.module';

import { CategoryListComponent } from './components/category/category-list/category-list.component';
import { CategoryNavigationComponent } from './components/category/category-navigation/category-navigation.component';
import { FilterCheckboxComponent } from './components/filter/filter-checkbox/filter-checkbox.component';
import { FilterDropdownComponent } from './components/filter/filter-dropdown/filter-dropdown.component';
import { FilterSwatchImagesComponent } from './components/filter/filter-swatch-images/filter-swatch-images.component';
import { ProductAttributesComponent } from './components/product/product-attributes/product-attributes.component';
import { ProductDetailActionsComponent } from './components/product/product-detail-actions/product-detail-actions.component';
import { ProductImagesComponent } from './components/product/product-images/product-images.component';
import { ProductInventoryComponent } from './components/product/product-inventory/product-inventory.component';
import { ProductListPagingComponent } from './components/product/product-list-paging/product-list-paging.component';
import { ProductListToolbarComponent } from './components/product/product-list-toolbar/product-list-toolbar.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { ProductQuantityComponent } from './components/product/product-quantity/product-quantity.component';
import { ProductRowComponent } from './components/product/product-row/product-row.component';
import { RecentlyViewedComponent } from './components/recently/recently-viewed/recently-viewed.component';
import { FilterNavigationContainerComponent } from './containers/filter-navigation/filter-navigation.container';
import { ProductListContainerComponent } from './containers/product-list/product-list.container';
import { ProductRowContainerComponent } from './containers/product-row/product-row.container';
import { RecentlyViewedContainerComponent } from './containers/recently-viewed/recently-viewed.container';

@NgModule({
  imports: [FormsSharedModule, QuotingSharedModule, SharedModule],
  declarations: [
    CategoryListComponent,
    CategoryNavigationComponent,
    FilterCheckboxComponent,
    FilterDropdownComponent,
    FilterNavigationContainerComponent,
    FilterSwatchImagesComponent,
    ProductAttributesComponent,
    ProductDetailActionsComponent,
    ProductImagesComponent,
    ProductInventoryComponent,
    ProductListComponent,
    ProductListContainerComponent,
    ProductListPagingComponent,
    ProductListToolbarComponent,
    ProductQuantityComponent,
    ProductRowComponent,
    ProductRowContainerComponent,
    RecentlyViewedComponent,
    RecentlyViewedContainerComponent,
  ],
  exports: [
    CategoryListComponent,
    CategoryNavigationComponent,
    FilterNavigationContainerComponent,
    ProductAttributesComponent,
    ProductDetailActionsComponent,
    ProductImagesComponent,
    ProductInventoryComponent,
    ProductListComponent,
    ProductListContainerComponent,
    ProductListPagingComponent,
    ProductListToolbarComponent,
    ProductQuantityComponent,
    ProductRowComponent,
    ProductRowContainerComponent,
    RecentlyViewedComponent,
    RecentlyViewedContainerComponent,
  ],
})
export class ShoppingSharedModule {}
