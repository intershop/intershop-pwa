import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { ActionReducerMap, StoreModule, provideState } from '@ngrx/store';
import { pick } from 'lodash-es';

import { CountriesEffects } from './countries/countries.effects';
import { countriesReducer } from './countries/countries.reducer';
import { GeneralState } from './general-store';
import { RegionsEffects } from './regions/regions.effects';
import { regionsReducer } from './regions/regions.reducer';

const generalReducers: ActionReducerMap<GeneralState> = {
  countries: countriesReducer,
  regions: regionsReducer,
};

const generalEffects = [CountriesEffects, RegionsEffects];

export function provideGeneralStore(): EnvironmentProviders {
  return makeEnvironmentProviders([provideState('general', generalReducers), provideEffects(generalEffects)]);
}

export class GeneralStoreProviders {
  static forTesting(...reducers: (keyof ActionReducerMap<GeneralState>)[]) {
    return StoreModule.forFeature('general', pick(generalReducers, reducers));
  }
}
