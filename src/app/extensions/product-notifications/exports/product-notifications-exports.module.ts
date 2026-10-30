import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { LazyProductNotificationEditComponent } from './lazy-product-notification-edit/lazy-product-notification-edit.component';

@NgModule({
  imports: [FeatureToggleModule],
  declarations: [LazyProductNotificationEditComponent],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'productNotifications',
        location: () =>
          import('../store/product-notifications-store.module').then(m => m.ProductNotificationsStoreModule),
      },
      multi: true,
    },
  ],
  exports: [LazyProductNotificationEditComponent],
})
export class ProductNotificationsExportsModule {}
