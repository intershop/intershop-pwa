import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, mapTo, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { AddressService } from 'ish-core/services/address/address.service';
import { SuccessMessage } from 'ish-core/store/messages';
import { UserActionTypes, getLoggedInCustomer } from 'ish-core/store/user';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import * as addressActions from './addresses.actions';

@Injectable()
export class AddressesEffects {
  constructor(private actions$: Actions, private addressService: AddressService, private store: Store<{}>) {}

  @Effect()
  loadAddresses$ = this.actions$.pipe(
    ofType(addressActions.AddressActionTypes.LoadAddresses),
    withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
    switchMap(([, customer]) =>
      this.addressService.getCustomerAddresses(customer.customerNo).pipe(
        map(addresses => new addressActions.LoadAddressesSuccess({ addresses })),
        mapErrorToAction(addressActions.LoadAddressesFail)
      )
    )
  );

  /**
   * Creates a new customer address.
   */
  @Effect()
  createCustomerAddress$ = this.actions$.pipe(
    ofType<addressActions.CreateCustomerAddress>(addressActions.AddressActionTypes.CreateCustomerAddress),
    mapToPayloadProperty('address'),
    withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
    filter(([address, customer]) => !!address || !!customer),
    concatMap(([address, customer]) =>
      this.addressService.createCustomerAddress(customer.customerNo, address).pipe(
        mergeMap(newAddress => [
          new addressActions.CreateCustomerAddressSuccess({ address: newAddress }),
          new SuccessMessage({
            message: 'account.addresses.new_address_created.message',
          }),
        ]),
        mapErrorToAction(addressActions.CreateCustomerAddressFail)
      )
    )
  );

  /**
   * Deletes a customer address.
   */
  @Effect()
  deleteCustomerAddress$ = this.actions$.pipe(
    ofType<addressActions.DeleteCustomerAddress>(addressActions.AddressActionTypes.DeleteCustomerAddress),
    mapToPayloadProperty('addressId'),
    withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
    filter(([addressId, customer]) => !!addressId || !!customer),
    mergeMap(([addressId, customer]) =>
      this.addressService.deleteCustomerAddress(customer.customerNo, addressId).pipe(
        map(id => new addressActions.DeleteCustomerAddressSuccess({ addressId: id })),
        mapErrorToAction(addressActions.DeleteCustomerAddressFail)
      )
    )
  );

  /**
   * Trigger ResetAddresses action after LogoutUser.
   */
  @Effect()
  resetAddressesAfterLogout$ = this.actions$.pipe(
    ofType(UserActionTypes.LogoutUser),
    mapTo(new addressActions.ResetAddresses())
  );
}
