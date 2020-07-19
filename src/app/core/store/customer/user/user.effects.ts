import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { EMPTY, merge, race, timer } from 'rxjs';
import {
  catchError,
  concatMap,
  concatMapTo,
  debounce,
  debounceTime,
  exhaustMap,
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
import { PaymentService } from 'ish-core/services/payment/payment.service';
import { PersonalizationService } from 'ish-core/services/personalization/personalization.service';
import { UserService } from 'ish-core/services/user/user.service';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { ofUrl, selectQueryParam, selectUrl } from 'ish-core/store/core/router';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import {
  createUser,
  createUserFail,
  deleteUserPaymentInstrument,
  deleteUserPaymentInstrumentFail,
  deleteUserPaymentInstrumentSuccess,
  loadCompanyUser,
  loadCompanyUserFail,
  loadCompanyUserSuccess,
  loadUserByAPIToken,
  loadUserPaymentMethods,
  loadUserPaymentMethodsFail,
  loadUserPaymentMethodsSuccess,
  loginUser,
  loginUserFail,
  loginUserSuccess,
  logoutUser,
  requestPasswordReminder,
  requestPasswordReminderFail,
  requestPasswordReminderSuccess,
  resetAPIToken,
  setPGID,
  updateCustomer,
  updateCustomerFail,
  updateCustomerSuccess,
  updateUser,
  updateUserFail,
  updateUserPassword,
  updateUserPasswordByPasswordReminder,
  updateUserPasswordByPasswordReminderFail,
  updateUserPasswordByPasswordReminderSuccess,
  updateUserPasswordFail,
  updateUserPasswordSuccess,
  updateUserSuccess,
  userErrorReset,
} from './user.actions';
import { getLoggedInCustomer, getLoggedInUser, getUserError } from './user.selectors';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private store$: Store,
    private userService: UserService,
    private paymentService: PaymentService,
    private personalizationService: PersonalizationService,
    private router: Router
  ) {}

  loginUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginUser),
      mapToPayloadProperty('credentials'),
      exhaustMap(credentials =>
        this.userService.signinUser(credentials).pipe(map(loginUserSuccess), mapErrorToAction(loginUserFail))
      )
    )
  );

  loadCompanyUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCompanyUser),
      mergeMap(() =>
        this.userService.getCompanyUserData().pipe(
          map(user => loadCompanyUserSuccess({ user })),
          mapErrorToAction(loadCompanyUserFail)
        )
      )
    )
  );

  goToLoginAfterLogoutBySessionTimeout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(resetAPIToken),
        switchMapTo(
          race(
            // wait for immediate LogoutUser
            this.actions$.pipe(ofType(logoutUser)),
            // or stop flow
            timer(1000).pipe(switchMapTo(EMPTY))
          )
        ),
        debounce(() => this.actions$.pipe(debounceTime(2000), first())),
        tap(() => {
          this.router.navigate(['/login'], {
            queryParams: { returnUrl: this.router.url, messageKey: 'session_timeout' },
          });
        })
      ),
    { dispatch: false }
  );

  /**
   * redirects to the returnUrl after successful login
   * does not redirect at all, if no returnUrl is defined
   */
  redirectAfterLogin$ = createEffect(
    () =>
      merge(
        this.actions$.pipe(
          ofType(loginUserSuccess),
          switchMapTo(this.store$.pipe(select(selectQueryParam('returnUrl')), first())),
          whenTruthy()
        ),
        this.store$.pipe(
          ofUrl(/^\/login.*/),
          select(selectQueryParam('returnUrl')),
          map(returnUrl => returnUrl || '/account'),
          switchMap(returnUrl => this.store$.pipe(select(getLoggedInUser), whenTruthy(), mapTo(returnUrl)))
        )
      ).pipe(
        whenTruthy(),
        tap(navigateTo => this.router.navigateByUrl(navigateTo))
      ),
    { dispatch: false }
  );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createUser),
      mapToPayload(),
      mergeMap((data: CustomerRegistrationType) =>
        this.userService.createUser(data).pipe(
          // TODO:see #IS-22750 - user should actually be logged in after registration
          map(() => loginUser({ credentials: data.credentials })),
          mapErrorToAction(createUserFail)
        )
      )
    )
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUser),
      mapToPayload(),
      withLatestFrom(this.store$.pipe(select(getLoggedInCustomer))),
      concatMap(([{ user, successMessage }, customer]) =>
        this.userService.updateUser({ user, customer }).pipe(
          map(changedUser => updateUserSuccess({ user: changedUser, successMessage })),
          mapErrorToAction(updateUserFail)
        )
      )
    )
  );

  updateUserPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserPassword),
      mapToPayload(),
      withLatestFrom(this.store$.pipe(select(getLoggedInCustomer))),
      withLatestFrom(this.store$.pipe(select(getLoggedInUser))),
      concatMap(([[payload, customer], user]) =>
        this.userService.updateUserPassword(customer, user, payload.password, payload.currentPassword).pipe(
          mapTo(
            updateUserPasswordSuccess({
              successMessage: payload.successMessage || 'account.profile.update_password.message',
            })
          ),
          mapErrorToAction(updateUserPasswordFail)
        )
      )
    )
  );

  updateCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCustomer),
      mapToPayload(),
      withLatestFrom(this.store$.pipe(select(getLoggedInCustomer))),
      filter(([, loggedInCustomer]) => !!loggedInCustomer && loggedInCustomer.isBusinessCustomer),
      concatMap(([{ customer, successMessage }]) =>
        this.userService.updateCustomer(customer).pipe(
          map(changedCustomer => updateCustomerSuccess({ customer: changedCustomer, successMessage })),
          mapErrorToAction(updateCustomerFail)
        )
      )
    )
  );

  redirectAfterUpdateOnProfileSettings$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(updateUserSuccess, updateCustomerSuccess, updateUserPasswordSuccess),
        withLatestFrom(this.store$.pipe(select(selectUrl))),
        filter(([, url]) => url.includes('/account/profile')),
        tap(() => {
          this.router.navigateByUrl('/account/profile');
        })
      ),
    { dispatch: false }
  );

  displayUpdateUserSuccessMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserPasswordSuccess, updateUserSuccess, updateCustomerSuccess),
      mapToPayloadProperty('successMessage'),
      filter(successMessage => !!successMessage),
      map(successMessage =>
        displaySuccessMessage({
          message: successMessage,
        })
      )
    )
  );

  resetUserError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      withLatestFrom(this.store$.pipe(select(getUserError))),
      filter(([, error]) => !!error),
      mapTo(userErrorReset())
    )
  );

  loadCompanyUserAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginUserSuccess),
      mapToPayload(),
      filter(payload => payload.customer.isBusinessCustomer),
      mapTo(loadCompanyUser())
    )
  );

  loadUserByAPIToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserByAPIToken),
      mapToPayloadProperty('apiToken'),
      concatMap(apiToken => this.userService.signinUserByToken(apiToken).pipe(map(loginUserSuccess)))
    )
  );

  fetchPGID$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginUserSuccess),
      switchMap(() =>
        this.personalizationService.getPGID().pipe(
          map(pgid => setPGID({ pgid })),
          catchError(() => EMPTY)
        )
      )
    )
  );

  loadUserPaymentMethods$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserPaymentMethods),
      withLatestFrom(this.store$.pipe(select(getLoggedInCustomer))),
      filter(([, customer]) => !!customer),
      concatMap(([, customer]) =>
        this.paymentService.getUserPaymentMethods(customer).pipe(
          map(result => loadUserPaymentMethodsSuccess({ paymentMethods: result })),
          mapErrorToAction(loadUserPaymentMethodsFail)
        )
      )
    )
  );

  deleteUserPayment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteUserPaymentInstrument),
      mapToPayloadProperty('id'),
      withLatestFrom(this.store$.pipe(select(getLoggedInCustomer))),
      filter(([, customer]) => !!customer),
      concatMap(([id, customer]) =>
        this.paymentService.deleteUserPaymentInstrument(customer.customerNo, id).pipe(
          concatMapTo([
            deleteUserPaymentInstrumentSuccess(),
            loadUserPaymentMethods(),
            displaySuccessMessage({
              message: 'account.payment.payment_deleted.message',
            }),
          ]),
          mapErrorToAction(deleteUserPaymentInstrumentFail)
        )
      )
    )
  );

  requestPasswordReminder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(requestPasswordReminder),
      mapToPayloadProperty('data'),
      concatMap(data =>
        this.userService
          .requestPasswordReminder(data)
          .pipe(map(requestPasswordReminderSuccess), mapErrorToAction(requestPasswordReminderFail))
      )
    )
  );

  updateUserPasswordByPasswordReminder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserPasswordByPasswordReminder),
      mapToPayload(),
      concatMap(data =>
        this.userService
          .updateUserPasswordByReminder(data)
          .pipe(
            map(updateUserPasswordByPasswordReminderSuccess),
            mapErrorToAction(updateUserPasswordByPasswordReminderFail)
          )
      )
    )
  );

  updateUserPasswordByPasswordReminderSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserPasswordByPasswordReminderSuccess),
      map(() =>
        displaySuccessMessage({
          message: 'account.profile.update_password.message',
        })
      )
    )
  );
}
