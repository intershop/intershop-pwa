import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';

import { TrackingConfigEffects } from './tracking-config/tracking-config.effects';
import { trackingConfigReducer } from './tracking-config/tracking-config.reducer';
import { TrackingState } from './tracking-store';
import { MatomoEffects } from '../../matomo/matomo.effects';

const trackingReducers: ActionReducerMap<TrackingState> = {
  gtmToken: trackingConfigReducer,
};

const trackingEffects = [TrackingConfigEffects, MatomoEffects];

// not-dead-code
@NgModule({
  imports: [EffectsModule.forFeature(trackingEffects), StoreModule.forFeature('tracking', trackingReducers)]
})
export class TrackingStoreModule {}
