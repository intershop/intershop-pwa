import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NotFoundStatusGuard } from 'ish-core/guards/not-found-status.guard';
import { matchCategoryRoute } from 'ish-core/routing/category/category.route';
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
  { path: '**', children: [], canActivate: [NotFoundStatusGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AppLastRoutingModule {}
