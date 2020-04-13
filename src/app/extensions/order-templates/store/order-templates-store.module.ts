import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, ReducerManager, Store, combineReducers } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { OrderTemplateEffects } from './order-template/order-template.effects';
import { orderTemplateReducer } from './order-template/order-template.reducer';
import { OrderTemplatesState } from './order-templates-store';

export const orderTemplatesReducers: ActionReducerMap<OrderTemplatesState> = {
  orderTemplates: orderTemplateReducer,
};

const orderTemplatesEffects = [OrderTemplateEffects];

const orderTemplatesFeature = 'orderTemplates';

@NgModule({
  imports: [EffectsModule.forFeature(orderTemplatesEffects)],
})
export class OrderTemplatesStoreModule {
  constructor(manager: ReducerManager, store: Store<{}>) {
    store.pipe(take(1)).subscribe(x => {
      if (!x[orderTemplatesFeature]) {
        manager.addReducers({ [orderTemplatesFeature]: combineReducers(orderTemplatesReducers) });
      }
    });
  }
}
