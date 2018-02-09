import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AccountLoginService } from '../../../core/services/account-login/account-login.service';
import { CustomerData } from '../../../models/customer/customer.interface';
import { CreateUser, CreateUserFail, CreateUserSuccess, LoginActionTypes, LoginUser, LoginUserFail, LoginUserSuccess } from '../actions/login.actions';
import { Go } from '../actions/router.actions';

@Injectable()
export class LoginEffects {
  constructor(
    private actions$: Actions,
    private accountLoginService: AccountLoginService
  ) { }

  @Effect()
  loginUser$ = this.actions$.pipe(
    ofType(LoginActionTypes.LoginUser),
    map((action: LoginUser) => action.payload),
    switchMap(credentials => {
      return this.accountLoginService.signinUser(credentials).pipe(
        map(customer => new LoginUserSuccess(customer)),
        catchError(error => of(new LoginUserFail(error)))
      );
    })
  );

  @Effect()
  goToHomeAfterLogout$ = this.actions$.pipe(
    ofType(LoginActionTypes.LogoutUser),
    switchMap(() => of(new Go({ path: ['/home'] })))
  );

  @Effect()
  goToAccountAfterLogin$ = this.actions$.pipe(
    ofType(LoginActionTypes.LoginUserSuccess),
    switchMap(() => of(new Go({ path: ['/account'] })))
  );

  @Effect()
  createUser$ = this.actions$.pipe(
    ofType(LoginActionTypes.CreateUser),
    map((action: CreateUser) => action.payload),
    switchMap((customerData: CustomerData) => {
      return this.accountLoginService.createUser(customerData).pipe(
        map(customer => new CreateUserSuccess(customer)),
        catchError(error => of(new CreateUserFail(error)))
      );
    })
  );

  @Effect()
  publishLoginEventAfterCreate$ = this.actions$.pipe(
    ofType(LoginActionTypes.CreateUserSuccess),
    switchMap((action: CreateUserSuccess) =>
      of(new LoginUserSuccess(action.payload)))
  );
}
