import { Injectable, InjectionToken, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { OrderTemplateEffects } from './order-template/order-template.effects';
import { orderTemplateReducer } from './order-template/order-template.reducer';
import { OrderTemplatesState } from './order-templates-store';

const orderTemplatesReducers: ActionReducerMap<OrderTemplatesState> = {
  orderTemplates: orderTemplateReducer,
};

const orderTemplatesEffects = [OrderTemplateEffects];

@Injectable()
export class OrderTemplatesStoreConfig implements StoreConfig<OrderTemplatesState> {
  metaReducers = [resetOnLogoutMeta];
}

export const ORDER_TEMPLATES_STORE_CONFIG = new InjectionToken<StoreConfig<OrderTemplatesState>>(
  'orderTemplatesStoreConfig'
);

@NgModule({
  imports: [
    EffectsModule.forFeature(orderTemplatesEffects),
    StoreModule.forFeature('orderTemplates', orderTemplatesReducers, ORDER_TEMPLATES_STORE_CONFIG),
  ],
  providers: [{ provide: ORDER_TEMPLATES_STORE_CONFIG, useClass: OrderTemplatesStoreConfig }],
})
export class OrderTemplatesStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<OrderTemplatesState>)[]) {
    return StoreModule.forFeature('orderTemplates', pick(orderTemplatesReducers, reducers));
  }
}
