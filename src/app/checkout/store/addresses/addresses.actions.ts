import { Action } from '@ngrx/store';

import { Address } from '../../../models/address/address.model';
import { HttpError } from '../../../models/http-error/http-error.model';

export enum AddressActionTypes {
  LoadAddresses = '[Address Internal] Load Addresses',
  LoadAddressesFail = '[Address API] Load Addresses Fail',
  LoadAddressesSuccess = '[Address API] Load Addresses Success',
  CreateCustomerAddressFail = '[Address API] Create Customer Address Fail',
  DeleteCustomerAddressFail = '[Address API] Delete Customer Address Fail',
  DeleteCustomerAddressSuccess = '[Address API] Delete Customer Address Success',
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

export class CreateCustomerAddressFail implements Action {
  readonly type = AddressActionTypes.CreateCustomerAddressFail;
  constructor(public payload: HttpError) {}
}

export class DeleteCustomerAddressFail implements Action {
  readonly type = AddressActionTypes.DeleteCustomerAddressFail;
  constructor(public payload: HttpError) {}
}

export class DeleteCustomerAddressSuccess implements Action {
  readonly type = AddressActionTypes.DeleteCustomerAddressSuccess;
  constructor(public payload: string) {}
}
export class ResetAddresses implements Action {
  readonly type = AddressActionTypes.ResetAddresses;
}

export type AddressAction =
  | LoadAddresses
  | LoadAddressesFail
  | LoadAddressesSuccess
  | CreateCustomerAddressFail
  | DeleteCustomerAddressFail
  | DeleteCustomerAddressSuccess
  | ResetAddresses;
