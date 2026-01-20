import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle.module';
import { authGuard } from 'ish-core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./account-product-notifications/account-product-notifications-page.component').then(
        m => m.AccountProductNotificationsPageComponent
      ),
    canActivate: [featureToggleGuard, authGuard],
    data: { feature: 'productNotifications' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ProductNotificationsRoutingModule {}
