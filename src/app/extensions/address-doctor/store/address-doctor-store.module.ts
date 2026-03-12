import { EnvironmentProviders, importProvidersFrom, makeEnvironmentProviders } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { AddressDoctorState } from './address-doctor-store';
import { AddressDoctorEffects } from './address-doctor/address-doctor.effects';
import { addressDoctorReducer } from './address-doctor/address-doctor.reducer';

const addressDoctorReducers: ActionReducerMap<AddressDoctorState> = {
  addressDoctorConfig: addressDoctorReducer,
};

const addressDoctorEffects = [AddressDoctorEffects];

const addressDoctorStoreImports = [
  EffectsModule.forFeature(addressDoctorEffects),
  StoreModule.forFeature('addressDoctor', addressDoctorReducers),
];

export function provideAddressDoctorStore(): EnvironmentProviders {
  return makeEnvironmentProviders([importProvidersFrom(...addressDoctorStoreImports)]);
}

export class AddressDoctorStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<AddressDoctorState>)[]) {
    return StoreModule.forFeature('addressDoctor', pick(addressDoctorReducers, reducers));
  }
}
