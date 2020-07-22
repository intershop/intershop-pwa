import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';

import { SentryConfigEffects } from './sentry-config/sentry-config.effects';
import { sentryConfigReducer } from './sentry-config/sentry-config.reducer';
import { SentryState } from './sentry-store';

const sentryReducers: ActionReducerMap<SentryState> = {
  config: sentryConfigReducer,
};

const sentryEffects = [SentryConfigEffects];

// not-dead-code
@NgModule({
  imports: [EffectsModule.forFeature(sentryEffects), StoreModule.forFeature('sentry', sentryReducers)],
})
export class SentryStoreModule {}
