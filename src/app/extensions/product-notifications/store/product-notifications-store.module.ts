import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { ProductNotificationEffects } from './product-notification/product-notification.effects';
import { productNotificationReducer } from './product-notification/product-notification.reducer';
import { ProductNotificationsState } from './product-notifications-store';

const productNotificationsReducers: ActionReducerMap<ProductNotificationsState> = {
  productNotifications: productNotificationReducer,
};

const productNotificationsEffects = [ProductNotificationEffects];

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
