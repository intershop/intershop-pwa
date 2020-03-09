import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { ProductBundlePartsComponent } from './product-bundle-parts/product-bundle-parts.component';
import { ProductDetailActionsComponent } from './product-detail-actions/product-detail-actions.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductImagesComponent } from './product-images/product-images.component';
import { ProductLinksCarouselComponent } from './product-links-carousel/product-links-carousel.component';
import { ProductLinksListComponent } from './product-links-list/product-links-list.component';
import { ProductLinksComponent } from './product-links/product-links.component';
import { ProductMasterVariationsComponent } from './product-master-variations/product-master-variations.component';
import { ProductPageComponent } from './product-page.component';
import { RetailSetPartsComponent } from './retail-set-parts/retail-set-parts.component';

const productPageRoutes: Routes = [
  {
    // compatibility to old routes
    path: 'product/:sku',
    children: [
      {
        path: '**',
        component: ProductPageComponent,
      },
    ],
  },
  {
    // compatibility to old routes
    path: 'category/:categoryUniqueId/product/:sku',
    children: [
      {
        path: '**',
        component: ProductPageComponent,
      },
    ],
  },
  { path: '**', component: ProductPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(productPageRoutes), SharedModule],
  declarations: [
    ProductBundlePartsComponent,
    ProductDetailActionsComponent,
    ProductDetailComponent,
    ProductImagesComponent,
    ProductLinksCarouselComponent,
    ProductLinksComponent,
    ProductLinksListComponent,
    ProductMasterVariationsComponent,
    ProductPageComponent,
    RetailSetPartsComponent,
  ],
})
export class ProductPageModule {}
