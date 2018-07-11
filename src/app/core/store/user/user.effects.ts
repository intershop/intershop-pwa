import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action, select, Store } from '@ngrx/store';
import { ROUTER_NAVIGATION_TYPE } from 'ngrx-router';
import { of } from 'rxjs';
import { catchError, filter, map, mergeMap, tap, withLatestFrom } from 'rxjs/operators';
import { Customer } from '../../../models/customer/customer.model';
import { RegistrationService } from '../../../registration/services/registration/registration.service';
import { CoreState } from '../core.state';
import * as errorActions from '../error/error.actions';
import * as userActions from './user.actions';
import { getUserError } from './user.selectors';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<CoreState>,
    private registrationService: RegistrationService,
    private router: Router
  ) {}

  @Effect()
  loginUser$ = this.actions$.pipe(
    ofType(userActions.UserActionTypes.LoginUser),
    map((action: userActions.LoginUser) => action.payload),
    mergeMap(credentials =>
      this.registrationService.signinUser(credentials).pipe(
        map(customer => new userActions.LoginUserSuccess(customer)),
        catchError(error => of(this.dispatchLogin(error)))
      )
    )
  );

  @Effect()
  loadCompanyUser$ = this.actions$.pipe(
    ofType(userActions.UserActionTypes.LoadCompanyUser),
    mergeMap(() =>
      this.registrationService.getCompanyUserData().pipe(
        map(user => new userActions.LoadCompanyUserSuccess(user)),
        catchError(error => of(new userActions.LoadCompanyUserFail(error)))
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
      if (state && state.snapshot && state.snapshot.root.queryParams['returnUrl']) {
        navigateTo = state.snapshot.root.queryParams['returnUrl'];
      } else {
        navigateTo = '/account';
      }
      this.router.navigate([navigateTo]);
    })
  );

  @Effect()
  createUser$ = this.actions$.pipe(
    ofType(userActions.UserActionTypes.CreateUser),
    map((action: userActions.CreateUser) => action.payload),
    mergeMap((customerData: Customer) =>
      this.registrationService.createUser(customerData).pipe(
        map(customer => new userActions.CreateUserSuccess(customer)),
        catchError(error => of(this.dispatchCreation(error)))
      )
    )
  );

  @Effect()
  resetUserError$ = this.actions$.pipe(
    ofType(ROUTER_NAVIGATION_TYPE),
    withLatestFrom(this.store$.pipe(select(getUserError))),
    filter(([action, error]) => !!error),
    map(() => new userActions.UserErrorReset())
  );

  @Effect()
  publishLoginEventAfterCreate$ = this.actions$.pipe(
    ofType(userActions.UserActionTypes.CreateUserSuccess),
    map((action: userActions.CreateUserSuccess) => new userActions.LoginUserSuccess(action.payload))
  );

  @Effect()
  loadCompanyUserAfterLogin$ = this.actions$.pipe(
    ofType(userActions.UserActionTypes.LoginUserSuccess),
    map((action: userActions.LoginUserSuccess) => action.payload),
    filter(customer => customer.type === 'SMBCustomer'),
    map(() => new userActions.LoadCompanyUser())
  );

  dispatchLogin(error): Action {
    if (error.headers.has('error-key')) {
      return new userActions.LoginUserFail(error);
    }
    return new errorActions.GeneralError(error);
  }

  dispatchCreation(error: HttpErrorResponse): Action {
    if (error.headers.has('error-key')) {
      return new userActions.CreateUserFail(error);
    }
    return new errorActions.GeneralError(error);
  }
}
