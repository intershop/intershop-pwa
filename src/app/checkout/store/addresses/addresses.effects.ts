import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserActionTypes } from '../../../core/store/user/user.actions';
import { AddressService } from '../../services/address/address.service';
import * as addressActions from './addresses.actions';

@Injectable()
export class AddressesEffects {
  constructor(private actions$: Actions, private addressService: AddressService) {}

  @Effect()
  loadAddresses$ = this.actions$.pipe(
    ofType(addressActions.AddressActionTypes.LoadAddresses),
    switchMap(() => {
      return this.addressService.getCustomerAddresses().pipe(
        map(addresses => new addressActions.LoadAddressesSuccess(addresses)),
        catchError(error => of(new addressActions.LoadAddressesFail(error)))
      );
    })
  );

  /**
   * Trigger ResetAddresses action after LogoutUser.
   */
  @Effect()
  resetAddressesAfterLogout$ = this.actions$.pipe(
    ofType(UserActionTypes.LogoutUser),
    map(() => new addressActions.ResetAddresses())
  );
}
