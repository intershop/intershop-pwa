import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle.module';

const routes: Routes = [
  {
    path: 'product-advisor',
    loadChildren: () => import('./product-advisor/product-advisor-page.module').then(m => m.ProductAdvisorPageModule),
    canActivate: [featureToggleGuard],
    data: {
      feature: 'productAdvisor',
      meta: {
        title: 'Product Advisor',
        robots: 'noindex, nofollow',
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ProductAdvisorRoutingModule {}
