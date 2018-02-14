import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AccountLoginService } from '../../../core/services/account-login/account-login.service';
import { CustomerData } from '../../../models/customer/customer.interface';
import { Go } from '../router/router.actions';
import * as userActions from './user.actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private accountLoginService: AccountLoginService
  ) { }

  @Effect()
  loginUser$ = this.actions$.pipe(
    ofType(userActions.UserActionTypes.LoginUser),
    map((action: userActions.LoginUser) => action.payload),
    switchMap(credentials => {
      return this.accountLoginService.signinUser(credentials).pipe(
        map(customer => new userActions.LoginUserSuccess(customer)),
        catchError(error => of(new userActions.LoginUserFail(error)))
      );
    })
  );

  @Effect()
  goToHomeAfterLogout$ = this.actions$.pipe(
    ofType(userActions.UserActionTypes.LogoutUser),
    switchMap(() => of(new Go({ path: ['/home'] })))
  );

  @Effect()
  goToAccountAfterLogin$ = this.actions$.pipe(
    ofType(userActions.UserActionTypes.LoginUserSuccess),
    switchMap(() => of(new Go({ path: ['/account'] })))
  );

  @Effect()
  createUser$ = this.actions$.pipe(
    ofType(userActions.UserActionTypes.CreateUser),
    map((action: userActions.CreateUser) => action.payload),
    switchMap((customerData: CustomerData) => {
      return this.accountLoginService.createUser(customerData).pipe(
        map(customer => new userActions.CreateUserSuccess(customer)),
        catchError(error => of(new userActions.CreateUserFail(error)))
      );
    })
  );

  @Effect()
  publishLoginEventAfterCreate$ = this.actions$.pipe(
    ofType(userActions.UserActionTypes.CreateUserSuccess),
    switchMap((action: userActions.CreateUserSuccess) =>
      of(new userActions.LoginUserSuccess(action.payload)))
  );
}
