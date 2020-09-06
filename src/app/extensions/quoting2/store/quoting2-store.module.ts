import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { QuotingEffects } from './quoting/quoting.effects';
import { quotingReducer } from './quoting/quoting.reducer';
import { Quoting2State } from './quoting2-store';

const quoting2Reducers: ActionReducerMap<Quoting2State> = { quoting: quotingReducer };

const quoting2Effects = [QuotingEffects];

@NgModule({
  imports: [EffectsModule.forFeature(quoting2Effects), StoreModule.forFeature('quoting2', quoting2Reducers)],
})
export class Quoting2StoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<Quoting2State>)[]) {
    return StoreModule.forFeature('quoting2', pick(quoting2Reducers, reducers));
  }
}
