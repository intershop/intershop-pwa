import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { CompareState } from './compare-store';

const compareReducers: ActionReducerMap<CompareState> = {};

const compareEffects = [];

// not-dead-code
@NgModule({
  imports: [EffectsModule.forFeature(compareEffects), StoreModule.forFeature('compare', compareReducers)],
})
export class CompareStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CompareState>)[]) {
    return StoreModule.forFeature('compare', pick(compareReducers, reducers));
  }
}
