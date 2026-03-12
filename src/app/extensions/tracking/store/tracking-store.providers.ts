import { EnvironmentProviders, importProvidersFrom, makeEnvironmentProviders } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';

import { TrackingConfigEffects } from './tracking-config/tracking-config.effects';
import { trackingConfigReducer } from './tracking-config/tracking-config.reducer';
import { TrackingState } from './tracking-store';

const trackingReducers: ActionReducerMap<TrackingState> = {
  gtmToken: trackingConfigReducer,
};

const trackingEffects = [TrackingConfigEffects];

const trackingStoreImports = [
  StoreModule.forFeature('tracking', trackingReducers),
  EffectsModule.forFeature(trackingEffects),
];

export function provideTrackingStore(): EnvironmentProviders {
  return makeEnvironmentProviders([importProvidersFrom(...trackingStoreImports)]);
}

export class TrackingStoreModule {}
