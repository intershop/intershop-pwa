import { Injectable, InjectionToken, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { QuotingState } from './quoting-store';
import { QuotingEffects } from './quoting/quoting.effects';
import { quotingReducer } from './quoting/quoting.reducer';

const quotingReducers: ActionReducerMap<QuotingState> = { quoting: quotingReducer };

const quotingEffects = [QuotingEffects];

@Injectable()
export class QuotingStoreConfig implements StoreConfig<QuotingState> {
  metaReducers = [resetOnLogoutMeta];
}

export const QUOTING_STORE_CONFIG = new InjectionToken<StoreConfig<QuotingState>>('quotingStoreConfig');

@NgModule({
  imports: [
    EffectsModule.forFeature(quotingEffects),
    StoreModule.forFeature('quoting', quotingReducers, QUOTING_STORE_CONFIG),
  ],
  providers: [{ provide: QUOTING_STORE_CONFIG, useClass: QuotingStoreConfig }],
})
export class QuotingStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<QuotingState>)[]) {
    return StoreModule.forFeature('quoting', pick(quotingReducers, reducers));
  }
}
