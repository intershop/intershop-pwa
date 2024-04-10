import { createSelector } from '@ngrx/store';

import { getAddressDoctorState } from '../address-doctor-store';

export const getAddressDoctorConfig = createSelector(getAddressDoctorState, state => state?.addressDoctorConfig);
