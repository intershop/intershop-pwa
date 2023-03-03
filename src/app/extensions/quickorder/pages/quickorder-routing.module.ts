import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle.module';

const routes: Routes = [
  {
    path: 'quick-order',
    loadChildren: () => import('./quickorder/quickorder-page.module').then(m => m.QuickorderPageModule),
    canActivate: [featureToggleGuard],
    data: { feature: 'quickorder', breadcrumbData: [{ key: 'quickorder.page.breadcrumb' }] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class QuickorderRoutingModule {}
