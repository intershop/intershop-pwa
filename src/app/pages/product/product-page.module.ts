import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { ProductBrandComponent } from './product-brand/product-brand.component';
import { ProductBundlePartsComponent } from './product-bundle-parts/product-bundle-parts.component';
import { ProductDetailActionsComponent } from './product-detail-actions/product-detail-actions.component';
import { ProductDetailInfoAccordionComponent } from './product-detail-info-accordion/product-detail-info-accordion.component';
import { ProductDetailVariationsComponent } from './product-detail-variations/product-detail-variations.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductImagesComponent } from './product-images/product-images.component';
import { ProductLinksCarouselComponent } from './product-links-carousel/product-links-carousel.component';
import { ProductLinksListComponent } from './product-links-list/product-links-list.component';
import { ProductLinksComponent } from './product-links/product-links.component';
import { ProductMasterLinkComponent } from './product-master-link/product-master-link.component';
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
    ProductBrandComponent,
    ProductBundlePartsComponent,
    ProductDetailActionsComponent,
    ProductDetailComponent,
    ProductDetailInfoAccordionComponent,
    ProductDetailVariationsComponent,
    ProductImagesComponent,
    ProductLinksCarouselComponent,
    ProductLinksComponent,
    ProductLinksListComponent,
    ProductMasterLinkComponent,
    ProductMasterVariationsComponent,
    ProductPageComponent,
    RetailSetPartsComponent,
  ],
})
export class ProductPageModule {}
