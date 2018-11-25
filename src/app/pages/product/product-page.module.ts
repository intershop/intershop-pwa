import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { QuotingSharedModule } from '../../extensions/quoting/shared/quoting-shared.module';
import { SharedModule } from '../../shared/shared.module';

import { ProductDetailActionsComponent } from './components/product-detail-actions/product-detail-actions.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductImagesComponent } from './components/product-images/product-images.component';
import { ProductQuantityComponent } from './components/product-quantity/product-quantity.component';
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
  imports: [QuotingSharedModule, RouterModule.forChild(productPageRoutes), SharedModule],
  declarations: [
    ProductDetailActionsComponent,
    ProductDetailComponent,
    ProductImagesComponent,
    ProductPageContainerComponent,
    ProductQuantityComponent,
  ],
})
export class ProductPageModule {}
