import { NgModule, importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle.module';
import { authGuard } from 'ish-core/guards/auth.guard';

import { ProductNotificationsStoreModule } from '../store/product-notifications-store.module';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./account-product-notifications/account-product-notifications-page.component').then(
        m => m.AccountProductNotificationsPageComponent
      ),
    canActivate: [featureToggleGuard, authGuard],
    data: { feature: 'productNotifications' },
    providers: [importProvidersFrom(ProductNotificationsStoreModule)],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class ProductNotificationsRoutingModule {}
