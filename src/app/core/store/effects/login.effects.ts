import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AccountLoginService } from '../../../core/services/account-login/account-login.service';
import { CustomerData } from '../../../models/customer/customer.interface';
import * as loginActions from '../actions/login.actions';
import * as routerActions from '../actions/router.actions';

@Injectable()
export class LoginEffects {
  constructor(
    private actions$: Actions,
    private accountLoginService: AccountLoginService
  ) { }

  @Effect()
  loginUser$ = this.actions$.pipe(
    ofType(loginActions.LOGIN_USER),
    map((action: loginActions.LoginUser) => action.payload),
    switchMap(credentials => {
      return this.accountLoginService.signinUser(credentials).pipe(
        map(customer => new loginActions.LoginUserSuccess(customer)),
        catchError(error => of(new loginActions.LoginUserFail(error)))
      );
    })
  );

  @Effect()
  goToHomeAfterLogout$ = this.actions$.pipe(
    ofType(loginActions.LOGOUT_USER),
    switchMap(() => of(new routerActions.Go({ path: ['/home'] })))
  );

  @Effect()
  goToAccountAfterLogin$ = this.actions$.pipe(
    ofType(loginActions.LOGIN_USER_SUCCESS),
    switchMap(() => of(new routerActions.Go({ path: ['/account'] })))
  );

  @Effect()
  createUser$ = this.actions$.pipe(
    ofType(loginActions.CREATE_USER),
    map((action: loginActions.CreateUser) => action.payload),
    switchMap((customerData: CustomerData) => {
      return this.accountLoginService.createUser(customerData).pipe(
        map(customer => new loginActions.CreateUserSuccess(customer)),
        catchError(error => of(new loginActions.CreateUserFail(error)))
      );
    })
  );

  @Effect()
  publishLoginEventAfterCreate$ = this.actions$.pipe(
    ofType(loginActions.CREATE_USER_SUCCESS),
    switchMap((action: loginActions.CreateUserSuccess) =>
      of(new loginActions.LoginUserSuccess(action.payload)))
  );
}
