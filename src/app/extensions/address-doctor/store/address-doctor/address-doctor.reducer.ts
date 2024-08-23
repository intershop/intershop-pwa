import { createReducer, on } from '@ngrx/store';

import { AddressDoctorConfig } from '../../models/address-doctor/address-doctor-config.model';

import { addressDoctorInternalActions } from './address-doctor.actions';

export const addressDoctorReducer = createReducer(
  undefined,
  on(addressDoctorInternalActions.setAddressDoctorConfig, (_, action): AddressDoctorConfig => action.payload.config)
);
