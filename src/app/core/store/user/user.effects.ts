import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { EMPTY, Observable, merge, of, race, timer } from 'rxjs';
import {
  catchError,
  concatMap,
  concatMapTo,
  debounce,
  debounceTime,
  filter,
  first,
  map,
  mapTo,
  mergeMap,
  switchMap,
  switchMapTo,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { CustomerRegistrationType } from 'ish-core/models/customer/customer.model';
import { HttpErrorMapper } from 'ish-core/models/http-error/http-error.mapper';
import { PaymentService } from 'ish-core/services/payment/payment.service';
import { PersonalizationService } from 'ish-core/services/personalization/personalization.service';
import { UserService } from 'ish-core/services/user/user.service';
import { GeneralError } from 'ish-core/store/error';
import { SuccessMessage } from 'ish-core/store/messages';
import { ofUrl, selectQueryParam } from 'ish-core/store/router';
import {
  mapErrorToAction,
  mapToPayload,
  mapToPayloadProperty,
  mapToProperty,
  whenTruthy,
} from 'ish-core/utils/operators';

import * as userActions from './user.actions';
import { getLoggedInCustomer, getLoggedInUser, getUserError } from './user.selectors';

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
    private paymentService: PaymentService,
    private personalizationService: PersonalizationService,
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
  goToLoginAfterLogoutBySessionTimeout$ = this.actions$.pipe(
    ofType(userActions.UserActionTypes.ResetAPIToken),
    switchMapTo(
      race(
        // wait for immediate LogoutUser
        this.actions$.pipe(ofType(userActions.UserActionTypes.LogoutUser)),
        // or stop flow
        timer(1000).pipe(switchMapTo(EMPTY))
      )
    ),
    debounce(() =>
      this.actions$.pipe(
        debounceTime(2000),
        first()
      )
    ),
    tap(() => {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url, messageKey: 'session_timeout' },
      });
    })
  );

  /*
   * redirects to the returnUrl after successful login
   * does not redirect at all, if no returnUrl is defined
   */
  @Effect({ dispatch: false })
  redirectAfterLogin$ = merge(
    this.actions$.pipe(
      ofType(userActions.UserActionTypes.LoginUserSuccess),
      map(() => this.router.routerState),
      mapToProperty('snapshot'),
      whenTruthy(),
      map(snapshot => snapshot.root.queryParams.returnUrl as string)
    ),
    this.store$.pipe(
      ofUrl(/^\/login.*/),
      select(selectQueryParam('returnUrl')),
      map(returnUrl => returnUrl || '/account'),
      switchMap(returnUrl =>
        this.store$.pipe(
          select(getLoggedInUser),
          whenTruthy(),
          mapTo(returnUrl)
        )
      )
    )
  ).pipe(
    whenTruthy(),
    tap(navigateTo => this.router.navigateByUrl(navigateTo))
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
    mapToPayload(),
    withLatestFrom(this.store$.pipe(select(getLoggedInCustomer))),
    concatMap(([payload, customer]) =>
      this.userService.updateUser({ user: payload.user, customer }).pipe(
        tap(() => {
          if (payload.successRouterLink) {
            this.router.navigateByUrl(payload.successRouterLink);
          }
        }),
        map(
          changedUser =>
            new userActions.UpdateUserSuccess({ user: changedUser, successMessage: payload.successMessage })
        ),
        mapErrorToAction(userActions.UpdateUserFail)
      )
    )
  );

  @Effect()
  updateUserPassword$ = this.actions$.pipe(
    ofType<userActions.UpdateUserPassword>(userActions.UserActionTypes.UpdateUserPassword),
    mapToPayload(),
    withLatestFrom(this.store$.pipe(select(getLoggedInCustomer))),
    withLatestFrom(this.store$.pipe(select(getLoggedInUser))),
    concatMap(([[payload, customer], user]) =>
      this.userService.updateUserPassword(customer, user, payload.password, payload.currentPassword).pipe(
        tap(() => this.router.navigateByUrl('/account/profile')),
        mapTo(
          new userActions.UpdateUserPasswordSuccess({
            successMessage: payload.successMessage || 'account.profile.update_password.message',
          })
        ),
        mapErrorToAction(userActions.UpdateUserPasswordFail)
      )
    )
  );

  @Effect()
  updateCustomer$ = this.actions$.pipe(
    ofType<userActions.UpdateCustomer>(userActions.UserActionTypes.UpdateCustomer),
    mapToPayload(),
    withLatestFrom(this.store$.pipe(select(getLoggedInCustomer))),
    filter(([, loggedInCustomer]) => !!loggedInCustomer && loggedInCustomer.isBusinessCustomer),
    concatMap(([payload]) =>
      this.userService.updateCustomer(payload.customer).pipe(
        tap(() => {
          if (payload.successRouterLink) {
            this.router.navigateByUrl(payload.successRouterLink);
          }
        }),
        map(
          changedCustomer =>
            new userActions.UpdateCustomerSuccess({ customer: changedCustomer, successMessage: payload.successMessage })
        ),
        mapErrorToAction(userActions.UpdateCustomerFail)
      )
    )
  );

  /* Displays a success message after an user/customer update action */
  @Effect()
  displayUpdateUserSuccessMessage$ = this.actions$.pipe(
    ofType(
      userActions.UserActionTypes.UpdateUserPasswordSuccess,
      userActions.UserActionTypes.UpdateUserSuccess,
      userActions.UserActionTypes.UpdateCustomerSuccess
    ),
    mapToPayloadProperty('successMessage'),
    filter(successMessage => !!successMessage),
    map(
      successMessage =>
        new SuccessMessage({
          message: successMessage,
        })
    )
  );

  @Effect()
  resetUserError$ = this.actions$.pipe(
    ofType(routerNavigatedAction),
    withLatestFrom(this.store$.pipe(select(getUserError))),
    filter(([, error]) => !!error),
    mapTo(new userActions.UserErrorReset())
  );

  @Effect()
  loadCompanyUserAfterLogin$ = this.actions$.pipe(
    ofType<userActions.LoginUserSuccess>(userActions.UserActionTypes.LoginUserSuccess),
    mapToPayload(),
    filter(payload => payload.customer.isBusinessCustomer),
    mapTo(new userActions.LoadCompanyUser())
  );

  @Effect()
  loadUserByAPIToken$ = this.actions$.pipe(
    ofType<userActions.LoadUserByAPIToken>(userActions.UserActionTypes.LoadUserByAPIToken),
    mapToPayloadProperty('apiToken'),
    concatMap(apiToken =>
      this.userService.signinUserByToken(apiToken).pipe(map(user => new userActions.LoginUserSuccess(user)))
    )
  );

  @Effect()
  fetchPGID$ = this.actions$.pipe(
    ofType(userActions.UserActionTypes.LoginUserSuccess),
    switchMap(() =>
      this.personalizationService.getPGID().pipe(
        map(pgid => new userActions.SetPGID({ pgid })),
        // tslint:disable-next-line:ban
        catchError(() => EMPTY)
      )
    )
  );

  @Effect()
  loadUserPaymentMethods$ = this.actions$.pipe(
    ofType<userActions.LoadUserPaymentMethods>(userActions.UserActionTypes.LoadUserPaymentMethods),
    withLatestFrom(this.store$.pipe(select(getLoggedInCustomer))),
    filter(([, customer]) => !!customer),
    concatMap(([, customer]) =>
      this.paymentService.getUserPaymentMethods(customer).pipe(
        map(result => new userActions.LoadUserPaymentMethodsSuccess({ paymentMethods: result })),
        mapErrorToAction(userActions.LoadUserPaymentMethodsFail)
      )
    )
  );

  @Effect()
  deleteUserPayment$ = this.actions$.pipe(
    ofType<userActions.DeleteUserPaymentInstrument>(userActions.UserActionTypes.DeleteUserPaymentInstrument),
    mapToPayloadProperty('id'),
    withLatestFrom(this.store$.pipe(select(getLoggedInCustomer))),
    filter(([, customer]) => !!customer),
    concatMap(([id, customer]) =>
      this.paymentService.deleteUserPaymentInstrument(customer.customerNo, id).pipe(
        concatMapTo([
          new userActions.DeleteUserPaymentInstrumentSuccess(),
          new userActions.LoadUserPaymentMethods(),
          new SuccessMessage({
            message: 'account.payment.payment_deleted.message',
          }),
        ]),
        mapErrorToAction(userActions.DeleteUserPaymentInstrumentFail)
      )
    )
  );

  @Effect()
  requestPasswordReminder$ = this.actions$.pipe(
    ofType<userActions.RequestPasswordReminder>(userActions.UserActionTypes.RequestPasswordReminder),
    mapToPayloadProperty('data'),
    concatMap(data =>
      this.userService.requestPasswordReminder(data).pipe(
        map(() => new userActions.RequestPasswordReminderSuccess()),
        mapErrorToAction(userActions.RequestPasswordReminderFail)
      )
    )
  );

  @Effect()
  updateUserPasswordByPasswordReminder$ = this.actions$.pipe(
    ofType<userActions.UpdateUserPasswordByPasswordReminder>(
      userActions.UserActionTypes.UpdateUserPasswordByPasswordReminder
    ),
    mapToPayload(),
    concatMap(data =>
      this.userService.updateUserPasswordByReminder(data).pipe(
        map(() => new userActions.UpdateUserPasswordByPasswordReminderSuccess()),
        mapErrorToAction(userActions.UpdateUserPasswordByPasswordReminderFail)
      )
    )
  );

  @Effect()
  updateUserPasswordByPasswordReminderSuccess$ = this.actions$.pipe(
    ofType<userActions.UpdateUserPasswordByPasswordReminderSuccess>(
      userActions.UserActionTypes.UpdateUserPasswordByPasswordReminderSuccess
    ),
    map(
      () =>
        new SuccessMessage({
          message: 'account.profile.update_password.message',
        })
    )
  );
}
