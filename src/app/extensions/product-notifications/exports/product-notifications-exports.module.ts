import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { loadFeatureProvider } from 'ish-core/utils/feature-toggle/feature-toggle.service';

import { LazyProductNotificationEditComponent } from './lazy-product-notification-edit/lazy-product-notification-edit.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    loadFeatureProvider('productNotifications', true, {
      location: () =>
        import('../store/product-notifications-store.module').then(m => m.ProductNotificationsStoreModule),
    }),
  ],
  declarations: [LazyProductNotificationEditComponent],
  exports: [LazyProductNotificationEditComponent],
})
export class ProductNotificationsExportsModule {}
