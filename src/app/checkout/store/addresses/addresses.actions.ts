import { Action } from '@ngrx/store';

import { Address } from '../../../models/address/address.model';
import { HttpError } from '../../../models/http-error/http-error.model';

export enum AddressActionTypes {
  LoadAddresses = '[Address Internal] Load Addresses',
  LoadAddressesFail = '[Address API] Load Addresses Fail',
  LoadAddressesSuccess = '[Address API] Load Addresses Success',
  ResetAddresses = '[Address Internal] Reset Addresses',
}

export class LoadAddresses implements Action {
  readonly type = AddressActionTypes.LoadAddresses;
}

export class LoadAddressesFail implements Action {
  readonly type = AddressActionTypes.LoadAddressesFail;
  constructor(public payload: HttpError) {}
}

export class LoadAddressesSuccess implements Action {
  readonly type = AddressActionTypes.LoadAddressesSuccess;
  constructor(public payload: Address[]) {}
}

export class ResetAddresses implements Action {
  readonly type = AddressActionTypes.ResetAddresses;
}

export type AddressAction = LoadAddresses | LoadAddressesFail | LoadAddressesSuccess | ResetAddresses;
