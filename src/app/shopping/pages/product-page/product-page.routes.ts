import { Routes } from '@angular/router';
import { ProductResolver } from '../../resolvers/product.resolver';
import { ProductPageComponent } from './product-page.component';

export const productPageRoutes: Routes = [
  { path: ':sku', component: ProductPageComponent, resolve: { product: ProductResolver } }
];
