import { NgModule } from '@angular/core';
import { FormsSharedModule } from '../forms/forms-shared.module';
import { QuotingSharedModule } from '../quoting/quoting-shared.module';
import { SharedProductModule } from '../shared/shared-product.module';
import { SharedModule } from '../shared/shared.module';
import { CategoryListComponent } from './components/category/category-list/category-list.component';
import { CategoryNavigationComponent } from './components/category/category-navigation/category-navigation.component';
import { FilterCheckboxComponent } from './components/filter/filter-checkbox/filter-checkbox.component';
import { FilterDropdownComponent } from './components/filter/filter-dropdown/filter-dropdown.component';
import { FilterSwatchImagesComponent } from './components/filter/filter-swatch-images/filter-swatch-images.component';
import { ProductAddToBasketComponent } from './components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductAttributesComponent } from './components/product/product-attributes/product-attributes.component';
import { ProductDetailActionsComponent } from './components/product/product-detail-actions/product-detail-actions.component';
import { ProductImagesComponent } from './components/product/product-images/product-images.component';
import { ProductInventoryComponent } from './components/product/product-inventory/product-inventory.component';
import { ProductListToolbarComponent } from './components/product/product-list-toolbar/product-list-toolbar.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { ProductPriceComponent } from './components/product/product-price/product-price.component';
import { ProductQuantityComponent } from './components/product/product-quantity/product-quantity.component';
import { ProductRowComponent } from './components/product/product-row/product-row.component';
import { ProductTileComponent } from './components/product/product-tile/product-tile.component';
import { RecentlyViewedComponent } from './components/recently/recently-viewed/recently-viewed.component';
import { FilterNavigationContainerComponent } from './containers/filter-navigation/filter-navigation.container';
import { ProductRowContainerComponent } from './containers/product-row/product-row.container';
import { ProductTileContainerComponent } from './containers/product-tile/product-tile.container';
import { RecentlyViewedContainerComponent } from './containers/recently-viewed/recently-viewed.container';

@NgModule({
  imports: [SharedModule, FormsSharedModule, SharedProductModule, QuotingSharedModule],
  declarations: [
    CategoryListComponent,
    CategoryNavigationComponent,
    ProductAttributesComponent,
    ProductImagesComponent,
    ProductListComponent,
    ProductPriceComponent,
    ProductRowComponent,
    ProductTileComponent,
    ProductPriceComponent,
    ProductInventoryComponent,
    ProductListToolbarComponent,
    ProductTileContainerComponent,
    ProductRowContainerComponent,
    ProductQuantityComponent,
    ProductAddToBasketComponent,
    ProductDetailActionsComponent,
    RecentlyViewedContainerComponent,
    RecentlyViewedComponent,
    FilterNavigationContainerComponent,
    FilterDropdownComponent,
    FilterCheckboxComponent,
    FilterSwatchImagesComponent,
  ],
  exports: [
    SharedProductModule,
    CategoryListComponent,
    CategoryNavigationComponent,
    ProductAttributesComponent,
    ProductImagesComponent,
    ProductListComponent,
    ProductRowComponent,
    ProductTileComponent,
    ProductPriceComponent,
    ProductInventoryComponent,
    ProductListToolbarComponent,
    ProductTileContainerComponent,
    ProductRowContainerComponent,
    ProductQuantityComponent,
    ProductAddToBasketComponent,
    ProductDetailActionsComponent,
    RecentlyViewedContainerComponent,
    RecentlyViewedComponent,
    FilterNavigationContainerComponent,
  ],
})
export class ShoppingSharedModule {}
