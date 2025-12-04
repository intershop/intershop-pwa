import { EnvironmentProviders, Injectable, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule, provideState } from '@ngrx/store';
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

const quotingStoreProviders = [{ provide: QUOTING_STORE_CONFIG, useClass: QuotingStoreConfig }];

export function provideQuotingStore(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState('quoting', quotingReducers, QUOTING_STORE_CONFIG),
    provideEffects(quotingEffects),
    ...quotingStoreProviders,
  ]);
}

export class QuotingStoreProviders {
  static forTesting(...reducers: (keyof ActionReducerMap<QuotingState>)[]) {
    return StoreModule.forFeature('quoting', pick(quotingReducers, reducers));
  }
}
