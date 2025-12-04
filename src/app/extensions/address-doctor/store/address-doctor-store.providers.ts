import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideEffects } from '@ngrx/effects';
import { ActionReducerMap, StoreModule, provideState } from '@ngrx/store';
import { pick } from 'lodash-es';

import { AddressDoctorState } from './address-doctor-store';
import { AddressDoctorEffects } from './address-doctor/address-doctor.effects';
import { addressDoctorReducer } from './address-doctor/address-doctor.reducer';

const addressDoctorReducers: ActionReducerMap<AddressDoctorState> = {
  addressDoctorConfig: addressDoctorReducer,
};

const addressDoctorEffects = [AddressDoctorEffects];

export function provideAddressDoctorStore(): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideState('addressDoctor', addressDoctorReducers),
    provideEffects(addressDoctorEffects),
  ]);
}

export class AddressDoctorStoreProviders {
  static forTesting(...reducers: (keyof ActionReducerMap<AddressDoctorState>)[]) {
    return StoreModule.forFeature('addressDoctor', pick(addressDoctorReducers, reducers));
  }
}
