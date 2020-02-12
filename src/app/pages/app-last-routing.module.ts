import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { matchProductRoute } from 'ish-core/routing/product/product.route';

const routes: Routes = [
  {
    matcher: matchProductRoute,
    loadChildren: () => import('./product/product-page.module').then(m => m.ProductPageModule),
  },
  { path: '**', redirectTo: '/error' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class AppLastRoutingModule {}
