import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { AddressService } from 'ish-core/services/address/address.service';
import { SuccessMessage } from 'ish-core/store/core/messages';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import {
  AddressActionTypes,
  CreateCustomerAddress,
  CreateCustomerAddressFail,
  CreateCustomerAddressSuccess,
  DeleteCustomerAddress,
  DeleteCustomerAddressFail,
  DeleteCustomerAddressSuccess,
  LoadAddressesFail,
  LoadAddressesSuccess,
} from './addresses.actions';

@Injectable()
export class AddressesEffects {
  constructor(private actions$: Actions, private addressService: AddressService, private store: Store) {}

  @Effect()
  loadAddresses$ = this.actions$.pipe(
    ofType(AddressActionTypes.LoadAddresses),
    withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
    switchMap(([, customer]) =>
      this.addressService.getCustomerAddresses(customer.customerNo).pipe(
        map(addresses => new LoadAddressesSuccess({ addresses })),
        mapErrorToAction(LoadAddressesFail)
      )
    )
  );

  /**
   * Creates a new customer address.
   */
  @Effect()
  createCustomerAddress$ = this.actions$.pipe(
    ofType<CreateCustomerAddress>(AddressActionTypes.CreateCustomerAddress),
    mapToPayloadProperty('address'),
    withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
    filter(([address, customer]) => !!address || !!customer),
    concatMap(([address, customer]) =>
      this.addressService.createCustomerAddress(customer.customerNo, address).pipe(
        mergeMap(newAddress => [
          new CreateCustomerAddressSuccess({ address: newAddress }),
          new SuccessMessage({
            message: 'account.addresses.new_address_created.message',
          }),
        ]),
        mapErrorToAction(CreateCustomerAddressFail)
      )
    )
  );

  /**
   * Deletes a customer address.
   */
  @Effect()
  deleteCustomerAddress$ = this.actions$.pipe(
    ofType<DeleteCustomerAddress>(AddressActionTypes.DeleteCustomerAddress),
    mapToPayloadProperty('addressId'),
    withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
    filter(([addressId, customer]) => !!addressId || !!customer),
    mergeMap(([addressId, customer]) =>
      this.addressService.deleteCustomerAddress(customer.customerNo, addressId).pipe(
        mergeMap(id => [
          new DeleteCustomerAddressSuccess({ addressId: id }),
          new SuccessMessage({ message: 'account.addresses.new_address_deleted.message' }),
        ]),
        mapErrorToAction(DeleteCustomerAddressFail)
      )
    )
  );
}
