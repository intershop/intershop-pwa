import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { QuotingState } from './quoting-store';
import { QuotingEffects } from './quoting/quoting.effects';
import { quotingReducer } from './quoting/quoting.reducer';

const quotingReducers: ActionReducerMap<QuotingState> = { quoting: quotingReducer };

const quotingEffects = [QuotingEffects];

// not-dead-code
@NgModule({
  imports: [
    EffectsModule.forFeature(quotingEffects),
    StoreModule.forFeature('quoting', quotingReducers, { metaReducers: [resetOnLogoutMeta] }),
  ],
})
export class QuotingStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<QuotingState>)[]) {
    return StoreModule.forFeature('quoting', pick(quotingReducers, reducers));
  }
}
