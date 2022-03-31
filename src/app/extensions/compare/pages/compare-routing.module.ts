import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';

const routes: Routes = [
  {
    path: 'compare',
    loadChildren: () => import('./compare/compare-page.module').then(m => m.ComparePageModule),
    canActivate: [FeatureToggleGuard],
    data: {
      feature: 'compare',
      meta: {
        title: 'product.compare.link',
        robots: 'noindex, nofollow',
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CompareRoutingModule {}
