import {
  EnvironmentProviders,
  Injectable,
  InjectionToken,
  makeEnvironmentProviders,
} from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule, provideState } from '@ngrx/store';
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

const productNotificationsStoreProviders = [
  { provide: PRODUCT_NOTIFICATIONS_STORE_CONFIG, useClass: ProductNotificationsConfig },
];

export function provideProductNotificationsStore(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState('productNotifications', productNotificationsReducers, PRODUCT_NOTIFICATIONS_STORE_CONFIG),
    provideEffects(productNotificationsEffects),
    ...productNotificationsStoreProviders,
  ]);
}

export class ProductNotificationsStoreProviders {
  static forTesting(...reducers: (keyof ActionReducerMap<ProductNotificationsState>)[]) {
    return StoreModule.forFeature('productNotifications', pick(productNotificationsReducers, reducers));
  }
}
