import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';

import { OrderTemplateEffects } from './order-template/order-template.effects';
import { orderTemplateReducer } from './order-template/order-template.reducer';
import { OrderTemplatesState } from './order-templates-store';

export const orderTemplatesReducers: ActionReducerMap<OrderTemplatesState> = {
  orderTemplates: orderTemplateReducer,
};

const orderTemplatesEffects = [OrderTemplateEffects];

// not-dead-code
@NgModule({
  imports: [
    EffectsModule.forFeature(orderTemplatesEffects),
    StoreModule.forFeature('orderTemplates', orderTemplatesReducers),
  ],
})
export class OrderTemplatesStoreModule {}
