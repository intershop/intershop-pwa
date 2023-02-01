import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { SparqueConfigEffects } from './sparque-config/sparque-config.effects';
import { sparqueConfigReducer } from './sparque-config/sparque-config.reducer';
import { SparqueState } from './sparque-store';

const sparqueReducers: ActionReducerMap<SparqueState> = {
  sparqueConfig: sparqueConfigReducer,
};

const sparqueEffects = [SparqueConfigEffects];

@NgModule({
  imports: [EffectsModule.forFeature(sparqueEffects), StoreModule.forFeature('sparque', sparqueReducers)],
})
export class SparqueStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<SparqueState>)[]) {
    return StoreModule.forFeature('sparque', pick(sparqueReducers, reducers));
  }
}
