import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AccountLoginService } from '../../../core/services/account-login/account-login.service';
import { CustomerData } from '../../../models/customer/customer.interface';
import * as userActions from './user.actions';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private accountLoginService: AccountLoginService,
    private router: Router
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

  @Effect({ dispatch: false })
  goToHomeAfterLogout$ = this.actions$.pipe(
    ofType(userActions.UserActionTypes.LogoutUser),
    tap(() => this.router.navigate(['/home']))
  );

  @Effect({ dispatch: false })
  goToAccountAfterLogin$ = this.actions$.pipe(
    ofType(userActions.UserActionTypes.LoginUserSuccess),
    tap(() => this.router.navigate(['/account']))
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
