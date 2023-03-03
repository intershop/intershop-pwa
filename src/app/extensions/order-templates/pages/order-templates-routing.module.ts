import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { authGuard } from 'ish-core/guards/auth.guard';
import { featureToggleGuard } from 'ish-core/guards/feature-toggle.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./account-order-template/account-order-template-page.module').then(m => m.AccountOrderTemplatePageModule),
    canActivate: [featureToggleGuard, authGuard],
    data: { feature: 'orderTemplates', breadcrumbData: [{ key: 'account.ordertemplates.link' }] },
  },
  {
    path: ':orderTemplateName',
    loadChildren: () =>
      import('./account-order-template-detail/account-order-template-detail-page.module').then(
        m => m.AccountOrderTemplateDetailPageModule
      ),
    canActivate: [featureToggleGuard, authGuard],
    data: { feature: 'orderTemplates' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderTemplatesRoutingModule {}
