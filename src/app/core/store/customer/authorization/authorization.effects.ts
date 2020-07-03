import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, mapTo, switchMap, withLatestFrom } from 'rxjs/operators';

import { AuthorizationService } from 'ish-core/services/authorization/authorization.service';
import { getLoggedInCustomer, getLoggedInUser, loadCompanyUserSuccess } from 'ish-core/store/customer/user';
import { mapErrorToAction } from 'ish-core/utils/operators';

import {
  loadRolesAndPermissions,
  loadRolesAndPermissionsFail,
  loadRolesAndPermissionsSuccess,
} from './authorization.actions';

@Injectable()
export class AuthorizationEffects {
  constructor(private actions$: Actions, private store: Store, private authorizationService: AuthorizationService) {}

  triggerLoading$ = createEffect(() =>
    this.actions$.pipe(ofType(loadCompanyUserSuccess), mapTo(loadRolesAndPermissions()))
  );

  loadRolesAndPermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRolesAndPermissions),
      withLatestFrom(this.store.pipe(select(getLoggedInUser)), this.store.pipe(select(getLoggedInCustomer))),
      switchMap(([, user, customer]) =>
        this.authorizationService.getRolesAndPermissions(customer, user).pipe(
          map(authorization => loadRolesAndPermissionsSuccess({ authorization })),
          mapErrorToAction(loadRolesAndPermissionsFail)
        )
      )
    )
  );
}
