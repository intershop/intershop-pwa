import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, mapTo, switchMap, withLatestFrom } from 'rxjs/operators';

import { mapErrorToAction } from 'ish-core/utils/operators';
import { AddressService } from '../../../services/address/address.service';
import { UserActionTypes, getLoggedInCustomer } from '../../user';

import * as addressActions from './addresses.actions';

@Injectable()
export class AddressesEffects {
  constructor(private actions$: Actions, private addressService: AddressService, private store: Store<{}>) {}

  @Effect()
  loadAddresses$ = this.actions$.pipe(
    ofType(addressActions.AddressActionTypes.LoadAddresses),
    withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
    filter(([, customer]) => !!customer),
    switchMap(([, customer]) =>
      this.addressService.getCustomerAddresses(customer.customerNo).pipe(
        map(addresses => new addressActions.LoadAddressesSuccess(addresses)),
        mapErrorToAction(addressActions.LoadAddressesFail)
      )
    )
  );

  /**
   * Creates a new customer address
   */
  @Effect()
  createCustomerAddress$ = this.actions$.pipe(
    ofType<addressActions.CreateCustomerAddress>(addressActions.AddressActionTypes.CreateCustomerAddress),
    map(action => action.payload),
    withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
    filter(([address, customer]) => !!address || !!customer),
    concatMap(([address, customer]) =>
      this.addressService.createCustomerAddress(customer.customerNo, address).pipe(
        map(newAddress => new addressActions.CreateCustomerAddressSuccess(newAddress)),
        mapErrorToAction(addressActions.CreateCustomerAddressFail)
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
