import { Routes } from '@angular/router';
import { ProductGuard } from '../../guards/product.guard';
import { ProductPageComponent } from './product-page.component';

export const productPageRoutes: Routes = [
  {
    path: ':sku',
    canActivate: [ProductGuard],
    component: ProductPageComponent
  }
];
