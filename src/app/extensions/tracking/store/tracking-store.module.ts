import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';

import { matomoSiteIdReducer, matomoTrackerReducer } from '../../matomo/store/matomo/matomo-config.actions';
import { MatomoEffects } from '../../matomo/store/matomo/matomo.effects';

import { TrackingConfigEffects } from './tracking-config/tracking-config.effects';
import { trackingConfigReducer } from './tracking-config/tracking-config.reducer';
import { MatomoState, TrackingState } from './tracking-store';

const trackingReducers: ActionReducerMap<TrackingState> = {
  gtmToken: trackingConfigReducer,
};

export const matomoReducer: ActionReducerMap<MatomoState> = {
  trackerUrl: matomoTrackerReducer,
  siteId: matomoSiteIdReducer,
};

console.log(matomoReducer.trackerUrl);

const trackingEffects = [TrackingConfigEffects];

const matomoEffects = [MatomoEffects];

// not-dead-code
@NgModule({
  imports: [
    EffectsModule.forFeature(trackingEffects),
    StoreModule.forFeature('tracking', trackingReducers),
    EffectsModule.forFeature(matomoEffects),
    StoreModule.forFeature('matomo', matomoReducer),
  ],
})
export class TrackingStoreModule {}
