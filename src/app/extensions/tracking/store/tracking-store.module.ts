import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';

import { MatomoEffects } from '../../matomo/store/matomo/matomo.effects';

import { TrackingConfigEffects } from './tracking-config/tracking-config.effects';
import { trackingConfigReducer } from './tracking-config/tracking-config.reducer';
import { TrackingState } from './tracking-store';

const trackingReducers: ActionReducerMap<TrackingState> = {
  gtmToken: trackingConfigReducer,
};

const trackingEffects = [TrackingConfigEffects];

const matomoEffects = [MatomoEffects];

const matomoEffects = [MatomoEffects];

const matomoEffects = [MatomoEffects];

// not-dead-code
@NgModule({
  imports: [
    EffectsModule.forFeature(trackingEffects),
    StoreModule.forFeature('tracking', trackingReducers),
    EffectsModule.forFeature(matomoEffects),
  ],
})
export class TrackingStoreModule {}
