import { Injectable, InjectionToken, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { ProductNotificationEffects } from './product-notification/product-notification.effects';
import { productNotificationReducer } from './product-notification/product-notification.reducer';
import { ProductNotificationsState } from './product-notifications-store';

const productNotificationsReducers: ActionReducerMap<ProductNotificationsState> = {
  productNotifications: productNotificationReducer,
};

const productNotificationsEffects = [ProductNotificationEffects];

@Injectable()
export class ProductNotificationsConfig implements StoreConfig<ProductNotificationsState> {
  metaReducers = [resetOnLogoutMeta];
}

export const PRODUCT_NOTIFICATIONS_STORE_CONFIG = new InjectionToken<StoreConfig<ProductNotificationsState>>(
  'productNotificationsStoreConfig'
);

@NgModule({
  imports: [
    EffectsModule.forFeature(productNotificationsEffects),
    StoreModule.forFeature('productNotifications', productNotificationsReducers, PRODUCT_NOTIFICATIONS_STORE_CONFIG),
  ],
  providers: [{ provide: PRODUCT_NOTIFICATIONS_STORE_CONFIG, useClass: ProductNotificationsConfig }],
})
export class ProductNotificationsStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<ProductNotificationsState>)[]) {
    return StoreModule.forFeature('productNotifications', pick(productNotificationsReducers, reducers));
  }
}
