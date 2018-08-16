import { Routes } from '@angular/router';

import { CategoryPageContainerComponent } from './category-page.container';

export const categoryPageRoutes: Routes = [
  {
    path: ':categoryUniqueId',
    component: CategoryPageContainerComponent,
  },
  {
    path: ':categoryUniqueId/product',
    loadChildren: '../product-page/product-page.module#ProductPageModule',
  },
];
