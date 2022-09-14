import { APP_BASE_HREF } from '@angular/common';
import { Inject, Injectable, InjectionToken, NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreConfig, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { DATA_RETENTION_POLICY } from 'ish-core/configurations/injection-keys';
import { DataRetentionPolicy, dataRetentionMeta } from 'ish-core/utils/meta-reducers';

import { RecentlyState } from './recently-store';
import { RecentlyEffects } from './recently/recently.effects';
import { recentlyReducer } from './recently/recently.reducer';

const recentlyReducers: ActionReducerMap<RecentlyState> = {
  _recently: recentlyReducer,
};

const recentlyEffects = [RecentlyEffects];

@Injectable()
export class DefaultRecentlyStoreConfig implements StoreConfig<RecentlyState> {
  metaReducers = [
    dataRetentionMeta<RecentlyState>(this.dataRetention.recently, this.appBaseHref, 'recently', '_recently'),
  ];

  constructor(
    @Inject(APP_BASE_HREF) private appBaseHref: string,
    @Inject(DATA_RETENTION_POLICY) private dataRetention: DataRetentionPolicy
  ) {}
}

export const RECENTLY_STORE_CONFIG = new InjectionToken<StoreConfig<RecentlyState>>('recentlyStoreConfig');

@NgModule({
  imports: [
    EffectsModule.forFeature(recentlyEffects),
    StoreModule.forFeature('recently', recentlyReducers, RECENTLY_STORE_CONFIG),
  ],
  providers: [{ provide: RECENTLY_STORE_CONFIG, useClass: DefaultRecentlyStoreConfig }],
})
export class RecentlyStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<RecentlyState>)[]) {
    return StoreModule.forFeature('recently', pick(recentlyReducers, reducers));
  }
}
