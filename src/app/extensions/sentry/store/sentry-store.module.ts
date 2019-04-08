import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, ReducerManager, Store, combineReducers } from '@ngrx/store';
import { take } from 'rxjs/operators';

import { SentryConfigEffects } from './sentry-config/sentry-config.effects';
import { sentryConfigReducer } from './sentry-config/sentry-config.reducer';
import { SentryState } from './sentry-store';

export const sentryReducers: ActionReducerMap<SentryState> = {
  config: sentryConfigReducer,
};

export const sentryEffects = [SentryConfigEffects];

const sentryFeature = 'sentry';
@NgModule({
  imports: [EffectsModule.forFeature(sentryEffects)],
})
export class SentryStoreModule {
  constructor(manager: ReducerManager, store: Store<{}>) {
    store.pipe(take(1)).subscribe(x => {
      if (!x[sentryFeature]) {
        manager.addReducers({ [sentryFeature]: combineReducers(sentryReducers) });
      }
    });
  }
}
