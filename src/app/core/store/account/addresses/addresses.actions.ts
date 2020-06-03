import { Action } from '@ngrx/store';

import { Address } from 'ish-core/models/address/address.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';

export enum AddressActionTypes {
  LoadAddresses = '[Address Internal] Load Addresses',
  LoadAddressesFail = '[Address API] Load Addresses Fail',
  LoadAddressesSuccess = '[Address API] Load Addresses Success',
  CreateCustomerAddress = '[Address] Create Customer Address',
  CreateCustomerAddressFail = '[Address API] Create Customer Address Fail',
  CreateCustomerAddressSuccess = '[Address API] Create Customer Address Success',
  UpdateCustomerAddressFail = '[Address API] Update Customer Address Fail',
  UpdateCustomerAddressSuccess = '[Address API] Update Customer Address Success',
  DeleteCustomerAddress = '[Address] Delete Customer Address',
  DeleteCustomerAddressFail = '[Address API] Delete Customer Address Fail',
  DeleteCustomerAddressSuccess = '[Address API] Delete Customer Address Success',
  ResetAddresses = '[Address Internal] Reset Addresses',
}

export class LoadAddresses implements Action {
  readonly type = AddressActionTypes.LoadAddresses;
}

export class LoadAddressesFail implements Action {
  readonly type = AddressActionTypes.LoadAddressesFail;
  constructor(public payload: { error: HttpError }) {}
}

export class LoadAddressesSuccess implements Action {
  readonly type = AddressActionTypes.LoadAddressesSuccess;
  constructor(public payload: { addresses: Address[] }) {}
}

export class CreateCustomerAddress implements Action {
  readonly type = AddressActionTypes.CreateCustomerAddress;
  constructor(public payload: { address: Address }) {}
}

export class CreateCustomerAddressFail implements Action {
  readonly type = AddressActionTypes.CreateCustomerAddressFail;
  constructor(public payload: { error: HttpError }) {}
}

export class CreateCustomerAddressSuccess implements Action {
  readonly type = AddressActionTypes.CreateCustomerAddressSuccess;
  constructor(public payload: { address: Address }) {}
}

export class UpdateCustomerAddressFail implements Action {
  readonly type = AddressActionTypes.UpdateCustomerAddressFail;
  constructor(public payload: { error: HttpError }) {}
}

export class UpdateCustomerAddressSuccess implements Action {
  readonly type = AddressActionTypes.UpdateCustomerAddressSuccess;
  constructor(public payload: { address: Address }) {}
}

export class DeleteCustomerAddress implements Action {
  readonly type = AddressActionTypes.DeleteCustomerAddress;
  constructor(public payload: { addressId: string }) {}
}

export class DeleteCustomerAddressFail implements Action {
  readonly type = AddressActionTypes.DeleteCustomerAddressFail;
  constructor(public payload: { error: HttpError }) {}
}

export class DeleteCustomerAddressSuccess implements Action {
  readonly type = AddressActionTypes.DeleteCustomerAddressSuccess;
  constructor(public payload: { addressId: string }) {}
}
export class ResetAddresses implements Action {
  readonly type = AddressActionTypes.ResetAddresses;
}

export type AddressAction =
  | LoadAddresses
  | LoadAddressesFail
  | LoadAddressesSuccess
  | CreateCustomerAddress
  | CreateCustomerAddressFail
  | CreateCustomerAddressSuccess
  | UpdateCustomerAddressFail
  | UpdateCustomerAddressSuccess
  | DeleteCustomerAddress
  | DeleteCustomerAddressFail
  | DeleteCustomerAddressSuccess
  | ResetAddresses;
