import { APP_BASE_HREF } from '@angular/common';
import { Inject, Injectable, InjectionToken, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { DATA_RETENTION_POLICY } from 'ish-core/configurations/injection-keys';
import { DataRetentionPolicy, dataRetentionMeta } from 'ish-core/utils/meta-reducers';

import { SparqueConfigEffects } from './sparque-config/sparque-config.effects';
import { sparqueConfigReducer } from './sparque-config/sparque-config.reducer';
import { SparqueState } from './sparque-store';

const sparqueReducers: ActionReducerMap<SparqueState> = {
  sparqueConfig: sparqueConfigReducer,
};

const sparqueEffects = [SparqueConfigEffects];

@Injectable()
export class DefaultSparqueStoreConfig implements StoreConfig<SparqueState> {
  metaReducers = [
    dataRetentionMeta<SparqueState>(this.dataRetention.sparque, this.appBaseHref, 'sparque', 'sparqueConfig'),
  ];

  constructor(
    @Inject(APP_BASE_HREF) private appBaseHref: string,
    @Inject(DATA_RETENTION_POLICY) private dataRetention: DataRetentionPolicy
  ) {}
}

export const SPARQUE_STORE_CONFIG = new InjectionToken<StoreConfig<SparqueState>>('sparqueStoreConfig');

@NgModule({
  imports: [
    EffectsModule.forFeature(sparqueEffects),
    StoreModule.forFeature('sparque', sparqueReducers, SPARQUE_STORE_CONFIG),
  ],
  providers: [{ provide: SPARQUE_STORE_CONFIG, useClass: DefaultSparqueStoreConfig }],
})
export class SparqueStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<SparqueState>)[]) {
    return StoreModule.forFeature('sparque', pick(sparqueReducers, reducers));
  }
}
