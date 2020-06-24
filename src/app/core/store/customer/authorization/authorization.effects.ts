import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

import { AuthorizationService } from 'ish-core/services/authorization/authorization.service';
import { getLoggedInCustomer, loadCompanyUserSuccess } from 'ish-core/store/customer/user';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import { loadRolesAndPermissionsFail, loadRolesAndPermissionsSuccess } from './authorization.actions';

@Injectable()
export class AuthorizationEffects {
  constructor(private actions$: Actions, private store: Store, private authorizationService: AuthorizationService) {}

  loadRolesAndPermissions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCompanyUserSuccess),
      mapToPayloadProperty('user'),
      withLatestFrom(this.store.pipe(select(getLoggedInCustomer))),
      switchMap(([user, customer]) =>
        this.authorizationService.getRolesAndPermissions(customer, user).pipe(
          map(authorization => loadRolesAndPermissionsSuccess({ authorization })),
          mapErrorToAction(loadRolesAndPermissionsFail)
        )
      )
    )
  );
}
