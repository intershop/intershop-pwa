import { Routes } from '@angular/router';
import { CategoryPathGuard } from '../../guards/category-path.guard';
import { CategoryGuard } from '../../guards/category.guard';
import { CategoryPageComponent } from './category-page.component';

export const categoryPageRoutes: Routes = [
  {
    path: ':categoryUniqueId',
    canActivate: [CategoryGuard, CategoryPathGuard],
    component: CategoryPageComponent
  },
  {
    path: ':categoryUniqueId/product',
    canActivate: [CategoryGuard],
    loadChildren: 'app/shopping/pages/product-page/product-page.module#ProductPageModule'
  }
];
