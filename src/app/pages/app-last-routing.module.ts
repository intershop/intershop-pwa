import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { notFoundStatusGuard } from 'ish-core/guards/not-found-status.guard';
import { matchCategoryRoute, prefetchCategoryPage } from 'ish-core/routing/category/category.route';
import { matchContentRoute, prefetchContentPage } from 'ish-core/routing/content-page/content-page.route';
import { matchProductRoute, prefetchProductPage } from 'ish-core/routing/product/product.route';

const routes: Routes = [
  {
    matcher: matchProductRoute,
    canMatch: [prefetchProductPage],
    loadChildren: () => import('./product/product-page.module').then(m => m.ProductPageModule),
  },
  {
    matcher: matchCategoryRoute,
    canMatch: [prefetchCategoryPage],
    loadChildren: () => import('./category/category-page.module').then(m => m.CategoryPageModule),
  },
  {
    matcher: matchContentRoute,
    canMatch: [prefetchContentPage],
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
