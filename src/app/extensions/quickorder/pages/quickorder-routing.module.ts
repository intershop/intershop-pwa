import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle.module';

const routes: Routes = [
  {
    path: 'quick-order',
    loadComponent: () => import('./quickorder/quickorder-page.component').then(m => m.QuickorderPageComponent),
    canActivate: [featureToggleGuard],
    data: {
      feature: 'quickorder',
      breadcrumbData: [{ key: 'quickorder.page.breadcrumb' }],
      meta: {
        title: 'quickorder.page.breadcrumb',
        robots: 'noindex, nofollow',
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class QuickorderRoutingModule {}
