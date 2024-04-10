import { createFeatureSelector } from '@ngrx/store';

import { AddressDoctorConfig } from '../models/address-doctor/address-doctor-config.model';

export interface AddressDoctorState {
  addressDoctorConfig: AddressDoctorConfig;
}

export const getAddressDoctorState = createFeatureSelector<AddressDoctorState>('addressDoctor');
