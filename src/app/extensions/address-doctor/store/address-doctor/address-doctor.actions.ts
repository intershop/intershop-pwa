import { createActionGroup, emptyProps } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

import { AddressDoctorConfig } from '../../models/address-doctor/address-doctor-config.model';

export const addressDoctorInternalActions = createActionGroup({
  source: 'Address Doctor Internal',
  events: {
    'Load Address Doctor Config': emptyProps(),
    'Set Address Doctor Config': payload<{ config: AddressDoctorConfig }>(),
  },
});
