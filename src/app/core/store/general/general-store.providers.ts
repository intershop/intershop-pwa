import { EnvironmentProviders, importProvidersFrom, makeEnvironmentProviders } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
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
const generalStoreImports = [
  EffectsModule.forFeature(generalEffects),
  StoreModule.forFeature('general', generalReducers),
];

export function provideGeneralStore(): EnvironmentProviders {
  return makeEnvironmentProviders([importProvidersFrom(...generalStoreImports)]);
}

export class GeneralStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<GeneralState>)[]) {
    return StoreModule.forFeature('general', pick(generalReducers, reducers));
  }
}
