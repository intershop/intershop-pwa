import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { ProductBundlePartsComponent } from './components/product-bundle-parts/product-bundle-parts.component';
import { ProductDetailActionsComponent } from './components/product-detail-actions/product-detail-actions.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductImagesComponent } from './components/product-images/product-images.component';
import { ProductLinksListComponent } from './components/product-links-list/product-links-list.component';
import { RetailSetPartsComponent } from './components/retail-set-parts/retail-set-parts.component';
import { ProductLinksContainerComponent } from './containers/product-links/product-links.container';
import { ProductPageContainerComponent } from './product-page.container';

const productPageRoutes: Routes = [
  {
    path: ':sku',
    children: [
      {
        path: '**',
        component: ProductPageContainerComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(productPageRoutes), SharedModule],
  declarations: [
    ProductBundlePartsComponent,
    ProductDetailActionsComponent,
    ProductDetailComponent,
    ProductImagesComponent,
    ProductLinksContainerComponent,
    ProductLinksListComponent,
    ProductPageContainerComponent,
    RetailSetPartsComponent,
  ],
})
export class ProductPageModule {}
