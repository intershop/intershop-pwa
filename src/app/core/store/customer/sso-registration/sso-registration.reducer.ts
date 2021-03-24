import { createReducer, on } from '@ngrx/store';

import { Address } from 'ish-core/models/address/address.model';

import { deleteRegistrationInfo, setRegistrationInfo } from './sso-registration.actions';

export interface SsoRegistrationState {
  address: Address;
  companyInfo: { companyName1: string; companyName2?: string; taxationID: string };
}

const initialState: SsoRegistrationState = {
  address: undefined,
  companyInfo: undefined,
};

export const ssoRegistrationReducer = createReducer(
  initialState,
  on(setRegistrationInfo, (_, action) => {
    const { companyInfo, address } = action.payload;
    return { companyInfo, address };
  }),
  on(deleteRegistrationInfo, () => ({ companyInfo: undefined, address: undefined }))
);
