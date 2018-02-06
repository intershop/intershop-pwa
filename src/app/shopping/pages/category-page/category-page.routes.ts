import { Routes } from '@angular/router';
import { CategoryPageComponent } from './category-page.component';

export const categoryPageRoutes: Routes = [
  {
    path: ':categoryUniqueId',
    component: CategoryPageComponent
  },
  {
    path: ':categoryUniqueId/product',
    loadChildren: 'app/shopping/pages/product-page/product-page.module#ProductPageModule'
  }
];
