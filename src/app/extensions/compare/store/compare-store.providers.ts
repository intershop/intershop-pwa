import { APP_BASE_HREF } from '@angular/common';
import { EnvironmentProviders, Inject, Injectable, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule, provideState } from '@ngrx/store';
import { pick } from 'lodash-es';

import { DATA_RETENTION_POLICY } from 'ish-core/configurations/injection-keys';
import { InjectSingle } from 'ish-core/utils/injection';
import { dataRetentionMeta } from 'ish-core/utils/meta-reducers';

import { CompareState } from './compare-store';
import { CompareEffects } from './compare/compare.effects';
import { compareReducer } from './compare/compare.reducer';

const compareReducers: ActionReducerMap<CompareState> = {
  _compare: compareReducer,
};

const compareEffects = [CompareEffects];

@Injectable()
export class DefaultCompareStoreConfig implements StoreConfig<CompareState> {
  metaReducers = [dataRetentionMeta<CompareState>(this.dataRetention.compare, this.appBaseHref, 'compare', '_compare')];

  constructor(
    @Inject(APP_BASE_HREF) private appBaseHref: string,
    @Inject(DATA_RETENTION_POLICY) private dataRetention: InjectSingle<typeof DATA_RETENTION_POLICY>
  ) {}
}

export const COMPARE_STORE_CONFIG = new InjectionToken<StoreConfig<CompareState>>('compareStoreConfig');

const compareStoreProviders = [{ provide: COMPARE_STORE_CONFIG, useClass: DefaultCompareStoreConfig }];

export function provideCompareStore(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState('compare', compareReducers, COMPARE_STORE_CONFIG),
    provideEffects(compareEffects),
    ...compareStoreProviders,
  ]);
}

export class CompareStoreProviders {
  static forTesting(...reducers: (keyof ActionReducerMap<CompareState>)[]) {
    return StoreModule.forFeature('compare', pick(compareReducers, reducers));
  }
}
