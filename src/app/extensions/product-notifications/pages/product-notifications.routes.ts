import { Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle.module';
import { authGuard } from 'ish-core/guards/auth.guard';

import { provideProductNotificationsStore } from '../store/product-notifications-store.module';

export const productNotificationsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./account-product-notifications/account-product-notifications-page.component').then(
        m => m.AccountProductNotificationsPageComponent
      ),
    canActivate: [featureToggleGuard, authGuard],
    data: { feature: 'productNotifications' },
    providers: [provideProductNotificationsStore()],
  },
];
