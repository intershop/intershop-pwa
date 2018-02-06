import { Routes } from '@angular/router';
import { ProductPageComponent } from './product-page.component';

export const productPageRoutes: Routes = [
  {
    path: ':sku',
    component: ProductPageComponent
  }
];
