import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';
import { AuthGuard } from 'ish-core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./account-product-notifications/account-product-notifications-page.module').then(
        m => m.AccountProductNotificationsPageModule
      ),
    canActivate: [FeatureToggleGuard, AuthGuard],
    data: { feature: 'productNotifications' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductNotificationsRoutingModule {}
