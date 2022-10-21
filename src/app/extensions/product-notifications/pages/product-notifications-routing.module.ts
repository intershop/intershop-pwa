import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./account-product-notifications/account-product-notifications-page.module').then(
        m => m.AccountProductNotificationsPageModule
      ),
    canActivate: [FeatureToggleGuard],
    data: { feature: 'productNotifications' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductNotificationsRoutingModule {}
