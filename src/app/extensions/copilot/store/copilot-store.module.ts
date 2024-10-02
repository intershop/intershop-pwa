import { NgModule, Type } from '@angular/core';
import { EffectsModule, FunctionalEffect } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { CopilotCheck } from './copilot-store';
import { copilotReducer } from './copilot.reducer';

const copilotReducers: ActionReducerMap<CopilotCheck> = {
  _copilot: copilotReducer,
};

const copilotEffects: (Type<unknown> | Record<string, FunctionalEffect>)[] = [];

@NgModule({
  imports: [EffectsModule.forFeature(copilotEffects), StoreModule.forFeature('copilot', copilotReducer)],
})
export class CopilotStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CopilotCheck>)[]) {
    return StoreModule.forFeature('copilot', pick(copilotReducers, reducers));
  }
}
