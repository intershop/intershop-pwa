import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { ContactEffects } from './contact/contact.effects';
import { contactReducer } from './contact/contact.reducer';
import { CountriesEffects } from './countries/countries.effects';
import { countriesReducer } from './countries/countries.reducer';
import { GeneralState } from './general-store';
import { RegionsEffects } from './regions/regions.effects';
import { regionsReducer } from './regions/regions.reducer';
import { ServerConfigEffects } from './server-config/server-config.effects';
import { serverConfigReducer } from './server-config/server-config.reducer';

const generalReducers: ActionReducerMap<GeneralState> = {
  countries: countriesReducer,
  regions: regionsReducer,
  contact: contactReducer,
  serverConfig: serverConfigReducer,
};

const generalEffects = [ContactEffects, CountriesEffects, RegionsEffects, ServerConfigEffects];

@NgModule({
  imports: [EffectsModule.forFeature(generalEffects), StoreModule.forFeature('general', generalReducers)],
})
export class GeneralStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<GeneralState>)[]) {
    return StoreModule.forFeature('general', pick(generalReducers, reducers));
  }
}
