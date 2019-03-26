import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { ROUTER_NAVIGATION_TYPE } from 'ngrx-router';
import { Observable, of } from 'rxjs';
import { catchError, concatMap, filter, map, mapTo, mergeMap, tap, withLatestFrom } from 'rxjs/operators';

import { CustomerRegistrationType } from 'ish-core/models/customer/customer.model';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';
import { HttpErrorMapper } from '../../models/http-error/http-error.mapper';
import { UserService } from '../../services/user/user.service';
import { GeneralError } from '../error';

import * as userActions from './user.actions';
import { getLoggedInCustomer, getUserError } from './user.selectors';

function mapUserErrorToActionIfPossible<T>(specific) {
  return (source$: Observable<T>) =>
    source$.pipe(
      // tslint:disable-next-line:ban
      catchError(error =>
        of(
          error.headers.has('error-key')
            ? new specific({ error: HttpErrorMapper.fromError(error) })
            : new GeneralError({ error: HttpErrorMapper.fromError(error) })
        )
      )
    );
}

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private store$: Store<{}>,
    private userService: UserService,
    private router: Router
  ) {}

  @Effect()
  loginUser$ = this.actions$.pipe(
    ofType<userActions.LoginUser>(userActions.UserActionTypes.LoginUser),
    mapToPayloadProperty('credentials'),
    mergeMap(credentials =>
      this.userService.signinUser(credentials).pipe(
        map(data => new userActions.LoginUserSuccess(data)),
        mapUserErrorToActionIfPossible(userActions.LoginUserFail)
      )
    )
  );

  @Effect()
  loadCompanyUser$ = this.actions$.pipe(
    ofType(userActions.UserActionTypes.LoadCompanyUser),
    mergeMap(() =>
      this.userService.getCompanyUserData().pipe(
        map(user => new userActions.LoadCompanyUserSuccess({ user })),
        mapErrorToAction(userActions.LoadCompanyUserFail)
      )
    )
  );

  @Effect({ dispatch: false })
  goToHomeAfterLogout$ = this.actions$.pipe(
    ofType(userActions.UserActionTypes.LogoutUser),
    tap(() => this.router.navigate(['/home']))
  );

  /*
   * redirects to the returnUrl after successful login
   * does not redirect at all, if no returnUrl is defined
   */
  @Effect({ dispatch: false })
  redirectAfterLogin$ = this.actions$.pipe(
    ofType(userActions.UserActionTypes.LoginUserSuccess),
    tap(() => {
      const state = this.router.routerState;
      let navigateTo: string;
      if (state && state.snapshot && state.snapshot.root.queryParams.returnUrl) {
        navigateTo = state.snapshot.root.queryParams.returnUrl;
      }
      if (navigateTo) {
        this.router.navigate([navigateTo]);
      }
    })
  );

  @Effect()
  createUser$ = this.actions$.pipe(
    ofType<userActions.CreateUser>(userActions.UserActionTypes.CreateUser),
    mapToPayload(),
    mergeMap((data: CustomerRegistrationType) =>
      this.userService.createUser(data).pipe(
        // TODO:see #IS-22750 - user should actually be logged in after registration
        map(() => new userActions.LoginUser({ credentials: data.credentials })),
        mapUserErrorToActionIfPossible(userActions.CreateUserFail)
      )
    )
  );

  @Effect()
  updateUser$ = this.actions$.pipe(
    ofType<userActions.UpdateUser>(userActions.UserActionTypes.UpdateUser),
    mapToPayloadProperty('user'),
    withLatestFrom(this.store$.pipe(select(getLoggedInCustomer))),
    concatMap(([user, customer]) =>
      this.userService.updateUser({ user, customer }).pipe(
        map(changedUser => new userActions.UpdateUserSuccess({ user: changedUser })),
        mapErrorToAction(userActions.UpdateUserFail)
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
  loadCompanyUserAfterLogin$ = this.actions$.pipe(
    ofType<userActions.LoginUserSuccess>(userActions.UserActionTypes.LoginUserSuccess),
    mapToPayload(),
    filter(payload => payload.customer.type === 'SMBCustomer'),
    mapTo(new userActions.LoadCompanyUser())
  );
}
