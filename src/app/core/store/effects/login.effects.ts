import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AccountLoginService } from '../../../core/services/account-login/account-login.service';
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

  @Effect({ dispatch: false })
  logoutUser$ = this.actions$.pipe(
    ofType(loginActions.LOGOUT_USER),
    switchMap(() => {
      this.accountLoginService.logout();
      return empty();
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
}
