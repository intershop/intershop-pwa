import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { ActionReducerMap, provideState } from '@ngrx/store';

import { TrackingConfigEffects } from './tracking-config/tracking-config.effects';
import { trackingConfigReducer } from './tracking-config/tracking-config.reducer';
import { TrackingState } from './tracking-store';

const trackingReducers: ActionReducerMap<TrackingState> = {
  gtmToken: trackingConfigReducer,
};

const trackingEffects = [TrackingConfigEffects];

export function provideTrackingStore(): EnvironmentProviders {
  return makeEnvironmentProviders([provideState('tracking', trackingReducers), provideEffects(trackingEffects)]);
}

export class TrackingStoreProviders {}
