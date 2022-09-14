import { APP_BASE_HREF } from '@angular/common';
import { Inject, Injectable, InjectionToken, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { DATA_RETENTION_POLICY } from 'ish-core/configurations/injection-keys';
import { DataRetentionPolicy, dataRetentionMeta } from 'ish-core/utils/meta-reducers';

import { ProductConfigurationEffects } from './product-configuration/product-configuration.effects';
import { productConfigurationReducer } from './product-configuration/product-configuration.reducer';
import { SavedTactonConfigurationEffects } from './saved-tacton-configuration/saved-tacton-configuration.effects';
import { savedTactonConfigurationReducer } from './saved-tacton-configuration/saved-tacton-configuration.reducer';
import { TactonConfigEffects } from './tacton-config/tacton-config.effects';
import { tactonConfigReducer } from './tacton-config/tacton-config.reducer';
import { TactonState } from './tacton-store';

const tactonReducers: ActionReducerMap<TactonState> = {
  productConfiguration: productConfigurationReducer,
  tactonConfig: tactonConfigReducer,
  _savedTactonConfiguration: savedTactonConfigurationReducer,
};

const tactonEffects = [ProductConfigurationEffects, TactonConfigEffects, SavedTactonConfigurationEffects];

@Injectable()
export class DefaultTactonStoreConfig implements StoreConfig<TactonState> {
  metaReducers = [
    dataRetentionMeta<TactonState>(this.dataRetention.tacton, this.appBaseHref, 'tacton', '_savedTactonConfiguration'),
  ];

  constructor(
    @Inject(APP_BASE_HREF) private appBaseHref: string,
    @Inject(DATA_RETENTION_POLICY) private dataRetention: DataRetentionPolicy
  ) {}
}

export const TACTON_STORE_CONFIG = new InjectionToken<StoreConfig<TactonState>>('tactonStoreConfig');

@NgModule({
  imports: [
    EffectsModule.forFeature(tactonEffects),
    StoreModule.forFeature('tacton', tactonReducers, TACTON_STORE_CONFIG),
  ],
  providers: [{ provide: TACTON_STORE_CONFIG, useClass: DefaultTactonStoreConfig }],
})
export class TactonStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<TactonState>)[]) {
    return StoreModule.forFeature('tacton', pick(tactonReducers, reducers));
  }
}
