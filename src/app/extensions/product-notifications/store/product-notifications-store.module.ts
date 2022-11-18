import { Injectable, NgModule } from '@angular/core';
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

@NgModule({
  imports: [
    EffectsModule.forFeature(productNotificationsEffects),
    StoreModule.forFeature('productNotifications', productNotificationsReducers),
  ],
})
export class ProductNotificationsStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<ProductNotificationsState>)[]) {
    return StoreModule.forFeature('productNotifications', pick(productNotificationsReducers, reducers));
  }
}
