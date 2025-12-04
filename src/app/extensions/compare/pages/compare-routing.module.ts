import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle.module';

const routes: Routes = [
  {
    path: 'compare',
    loadComponent() {
      return import('./compare/compare-page.component').then(c => c.ComparePageComponent);
    },
    canActivate: [featureToggleGuard],
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
})
export class CompareRoutingModule {}
