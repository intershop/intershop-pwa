import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { notFoundStatusGuard } from 'ish-core/guards/not-found-status.guard';
import { matchCategoryRoute } from 'ish-core/routing/category/category.route';
import { matchContentRoute } from 'ish-core/routing/content-page/content-page.route';
import { matchProductRoute } from 'ish-core/routing/product/product.route';

const routes: Routes = [
  {
    path: 'product/:sku',
    loadComponent: () => import('./product/product-page.component').then(c => c.ProductPageComponent),
    data: { legacy: true },
  },
  {
    path: 'category/:categoryUniqueId/product/:sku',
    loadComponent: () => import('./product/product-page.component').then(c => c.ProductPageComponent),
    data: { legacy: true },
  },
  {
    path: 'category/:categoryUniqueId',
    loadComponent: () => import('./category/category-page.component').then(c => c.CategoryPageComponent),
    data: { legacy: true },
  },
  {
    path: 'categoryref/:categoryRefId',
    loadComponent: () => import('./category/category-page.component').then(c => c.CategoryPageComponent),
    data: { legacy: true },
  },
  {
    matcher: matchProductRoute,
    loadComponent: () => import('./product/product-page.component').then(c => c.ProductPageComponent),
  },
  {
    matcher: matchCategoryRoute,
    loadComponent: () => import('./category/category-page.component').then(c => c.CategoryPageComponent),
  },
  {
    matcher: matchContentRoute,
    loadChildren: () => import('./content/content-page.module').then(m => m.ContentPageModule),
  },
  {
    path: '**',
    canActivate: [notFoundStatusGuard],
    loadChildren: () => import('./error/error-page.module').then(m => m.ErrorPageModule),
    data: {
      meta: {
        title: 'seo.title.error',
        robots: 'noindex, nofollow',
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AppLastRoutingModule {}
