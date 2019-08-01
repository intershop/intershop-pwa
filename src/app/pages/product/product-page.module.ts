import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';

import { ProductBundlePartsComponent } from './components/product-bundle-parts/product-bundle-parts.component';
import { ProductDetailActionsComponent } from './components/product-detail-actions/product-detail-actions.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductImagesComponent } from './components/product-images/product-images.component';
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
    ProductPageContainerComponent,
  ],
})
export class ProductPageModule {}
