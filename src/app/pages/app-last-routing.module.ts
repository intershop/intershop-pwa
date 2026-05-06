import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { notFoundStatusGuard } from 'ish-core/guards/not-found-status.guard';
import { matchCategoryRoute } from 'ish-core/routing/category/category.route';
import { matchContentRoute } from 'ish-core/routing/content-page/content-page.route';
import { matchProductRoute } from 'ish-core/routing/product/product.route';

const routes: Routes = [
  {
    matcher: matchProductRoute,
    loadChildren: () => import('./product/product-page.module').then(m => m.ProductPageModule),
  },
  {
    matcher: matchCategoryRoute,
    loadChildren: () => import('./category/category-page.module').then(m => m.CategoryPageModule),
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
