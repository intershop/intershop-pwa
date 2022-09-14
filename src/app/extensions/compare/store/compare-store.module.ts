import { APP_BASE_HREF } from '@angular/common';
import { Inject, Injectable, InjectionToken, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { DATA_RETENTION_POLICY } from 'ish-core/configurations/injection-keys';
import { DataRetentionPolicy, dataRetentionMeta } from 'ish-core/utils/meta-reducers';

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
    @Inject(DATA_RETENTION_POLICY) private dataRetention: DataRetentionPolicy
  ) {}
}

export const COMPARE_STORE_CONFIG = new InjectionToken<StoreConfig<CompareState>>('compareStoreConfig');

@NgModule({
  imports: [
    EffectsModule.forFeature(compareEffects),
    StoreModule.forFeature('compare', compareReducers, COMPARE_STORE_CONFIG),
  ],
  providers: [{ provide: COMPARE_STORE_CONFIG, useClass: DefaultCompareStoreConfig }],
})
export class CompareStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CompareState>)[]) {
    return StoreModule.forFeature('compare', pick(compareReducers, reducers));
  }
}
