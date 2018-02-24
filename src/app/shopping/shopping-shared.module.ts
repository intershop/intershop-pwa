import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '../shared/shared.module';
import { CategoryNavigationComponent } from './components/category//category-navigation/category-navigation.component';
import { CategoryListComponent } from './components/category/category-list/category-list.component';
import { ProductImageComponent } from './components/product/product-image/product-image.component';
import { ProductImagesComponent } from './components/product/product-images/product-images.component';
import { ProductInventoryComponent } from './components/product/product-inventory/product-inventory.component';
import { ProductListToolbarComponent } from './components/product/product-list-toolbar/product-list-toolbar.component';
import { ProductListComponent } from './components/product/product-list/product-list.component';
import { ProductPriceComponent } from './components/product/product-price/product-price.component';
import { ProductRowActionsComponent } from './components/product/product-row-actions/product-row-actions.component';
import { ProductRowComponent } from './components/product/product-row/product-row.component';
import { ProductShipmentComponent } from './components/product/product-shipment/product-shipment.component';
import { ProductTileActionsComponent } from './components/product/product-tile-actions/product-tile-actions.component';
import { ProductTileComponent } from './components/product/product-tile/product-tile.component';
import { ProductRowActionsContainerComponent } from './containers/product-row-actions/product-row-actions.container';
import { ProductTileActionsContainerComponent } from './containers/product-tile-actions/product-tile-actions.container';
import { effects, reducers } from './store/shopping.system';

@NgModule({
  imports: [
    SharedModule,
    StoreModule.forFeature('shopping', reducers),
    EffectsModule.forFeature(effects)
  ],
  declarations: [
    CategoryListComponent,
    CategoryNavigationComponent,
    ProductImagesComponent,
    ProductImageComponent,
    ProductListComponent,
    ProductPriceComponent,
    ProductRowComponent,
    ProductTileComponent,
    ProductPriceComponent,
    ProductInventoryComponent,
    ProductShipmentComponent,
    ProductListToolbarComponent,
    ProductTileActionsContainerComponent,
    ProductTileActionsComponent,
    ProductRowActionsContainerComponent,
    ProductRowActionsComponent
  ],
  exports: [
    CategoryListComponent,
    CategoryNavigationComponent,
    ProductImageComponent,
    ProductImagesComponent,
    ProductListComponent,
    ProductRowComponent,
    ProductTileComponent,
    ProductPriceComponent,
    ProductInventoryComponent,
    ProductShipmentComponent,
    ProductListToolbarComponent,
    ProductTileActionsContainerComponent,
    ProductTileActionsComponent,
    ProductRowActionsContainerComponent,
    ProductRowActionsComponent
  ]
})

export class ShoppingSharedModule { }
