import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { ROUTER_NAVIGATION_TYPE } from 'ngrx-router';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, mapTo, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { Customer } from '../../../models/customer/customer.model';
import { HttpErrorMapper } from '../../../models/http-error/http-error.mapper';
import { RegistrationService } from '../../../registration/services/registration/registration.service';
import { mapErrorToAction } from '../../../utils/operators';
import { GeneralError } from '../error';

import * as userActions from './user.actions';
import { getUserError } from './user.selectors';

function mapUserErrorToActionIfPossible<T>(specific) {
  return (source$: Observable<T>) =>
    source$.pipe(
      // tslint:disable-next-line:ban
      catchError(error =>
        of(
          error.headers.has('error-key')
            ? new specific(HttpErrorMapper.fromError(error))
            : new GeneralError(HttpErrorMapper.fromError(error))
        )
      )
    );
}

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<{}>,
    private registrationService: RegistrationService,
    private router: Router
  ) {}

  @Effect()
  loginUser$ = this.actions$.pipe(
    ofType<userActions.LoginUser>(userActions.UserActionTypes.LoginUser),
    map(action => action.payload),
    mergeMap(credentials =>
      this.registrationService.signinUser(credentials).pipe(
        map(customer => new userActions.LoginUserSuccess(customer)),
        mapUserErrorToActionIfPossible(userActions.LoginUserFail)
      )
    )
  );

  @Effect()
  loadCompanyUser$ = this.actions$.pipe(
    ofType(userActions.UserActionTypes.LoadCompanyUser),
    mergeMap(() =>
      this.registrationService.getCompanyUserData().pipe(
        map(user => new userActions.LoadCompanyUserSuccess(user)),
        mapErrorToAction(userActions.LoadCompanyUserFail)
      )
    )
  );

  @Effect({ dispatch: false })
  goToHomeAfterLogout$ = this.actions$.pipe(
    ofType(userActions.UserActionTypes.LogoutUser),
    tap(() => this.router.navigate(['/home']))
  );

  @Effect({ dispatch: false })
  goToAccountAfterLogin$ = this.actions$.pipe(
    ofType(userActions.UserActionTypes.LoginUserSuccess),
    tap(() => {
      const state = this.router.routerState;
      let navigateTo: string;
      if (state && state.snapshot && state.snapshot.root.queryParams.returnUrl) {
        navigateTo = state.snapshot.root.queryParams.returnUrl;
      } else {
        navigateTo = '/account';
      }
      this.router.navigate([navigateTo]);
    })
  );

  @Effect()
  createUser$ = this.actions$.pipe(
    ofType<userActions.CreateUser>(userActions.UserActionTypes.CreateUser),
    map(action => action.payload),
    mergeMap((customerData: Customer) =>
      this.registrationService.createUser(customerData).pipe(
        map(customer => new userActions.CreateUserSuccess(customer)),
        mapUserErrorToActionIfPossible(userActions.CreateUserFail)
      )
    )
  );

  @Effect()
  resetUserError$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION_TYPE),
    withLatestFrom(this.store$.pipe(select(getUserError))),
    filter(([, error]) => !!error),
    mapTo(new userActions.UserErrorReset())
  );

  @Effect()
  publishLoginEventAfterCreate$ = this.actions$.pipe(
    ofType<userActions.CreateUserSuccess>(userActions.UserActionTypes.CreateUserSuccess),
    map(action => new userActions.LoginUserSuccess(action.payload))
  );

  @Effect()
  loadCompanyUserAfterLogin$ = this.actions$.pipe(
    ofType<userActions.LoginUserSuccess>(userActions.UserActionTypes.LoginUserSuccess),
    map(action => action.payload),
    filter(customer => customer.type === 'SMBCustomer'),
    mapTo(new userActions.LoadCompanyUser())
  );
}
