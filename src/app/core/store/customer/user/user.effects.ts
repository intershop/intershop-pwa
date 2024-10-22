import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { from } from 'rxjs';
import { concatMap, delay, exhaustMap, filter, map, mergeMap, sample, switchMap, withLatestFrom } from 'rxjs/operators';

import { CustomerRegistrationType } from 'ish-core/models/customer/customer.model';
import { PaymentService } from 'ish-core/services/payment/payment.service';
import { TokenService } from 'ish-core/services/token/token.service';
import { UserService } from 'ish-core/services/user/user.service';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { selectQueryParam, selectUrl } from 'ish-core/store/core/router';
import { getServerConfigParameter } from 'ish-core/store/core/server-config';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { getPGID, personalizationStatusDetermined } from '.';
import {
  createUser,
  createUserApprovalRequired,
  createUserFail,
  createUserSuccess,
  deleteUserPaymentInstrument,
  deleteUserPaymentInstrumentFail,
  deleteUserPaymentInstrumentSuccess,
  fetchAnonymousUserToken,
  loadCompanyUser,
  loadCompanyUserFail,
  loadCompanyUserSuccess,
  loadUserByAPIToken,
  loadUserCostCenters,
  loadUserCostCentersFail,
  loadUserCostCentersSuccess,
  loadUserPaymentMethods,
  loadUserPaymentMethodsFail,
  loadUserPaymentMethodsSuccess,
  loginUser,
  loginUserFail,
  loginUserSuccess,
  loginUserWithToken,
  logoutUser,
  logoutUserFail,
  logoutUserSuccess,
  requestPasswordReminder,
  requestPasswordReminderFail,
  requestPasswordReminderSuccess,
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
  updateUserPreferredPayment,
  updateUserSuccess,
  userErrorReset,
  userNewsletterActions,
} from './user.actions';
import { getLoggedInCustomer, getLoggedInUser, getUserError } from './user.selectors';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private store: Store,
    private userService: UserService,
    private paymentService: PaymentService,
    private router: Router,
    private apiTokenService: ApiTokenService,
    private tokenService: TokenService
  ) {}

  loginUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginUser),
      mapToPayloadProperty('credentials'),
      exhaustMap(credentials =>
        this.userService.signInUser(credentials).pipe(map(loginUserSuccess), mapErrorToAction(loginUserFail))
      )
    )
  );

  /**
   * Revoke token on server side
   */
  logoutUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(logoutUser),
      switchMap(() => this.userService.logoutUser().pipe(map(logoutUserSuccess), mapErrorToAction(logoutUserFail)))
    )
  );

  fetchAnonymousUserToken$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(fetchAnonymousUserToken),
        switchMap(() => this.tokenService.fetchToken('anonymous'))
      ),
    { dispatch: false }
  );

  loginUserWithToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginUserWithToken),
      mapToPayloadProperty('token'),
      exhaustMap(token =>
        this.userService.signInUserByToken(token).pipe(map(loginUserSuccess), mapErrorToAction(loginUserFail))
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

  /**
   * redirects to the returnUrl after successful login
   * does not redirect at all, if no returnUrl is defined
   */
  redirectAfterLogin$ =
    !SSR &&
    createEffect(
      () =>
        this.store.pipe(select(selectQueryParam('returnUrl'))).pipe(
          whenTruthy(),
          sample(this.actions$.pipe(ofType(loginUserSuccess))),
          concatMap(navigateTo => from(this.router.navigateByUrl(navigateTo)))
        ),
      { dispatch: false }
    );

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createUser),
      mapToPayload(),
      mergeMap((data: CustomerRegistrationType) =>
        this.userService.createUser(data).pipe(
          withLatestFrom(
            this.store.pipe(select(getServerConfigParameter<string[]>('general.customerTypeForLoginApproval')))
          ),
          concatMap(([createUserResponse, customerTypeForLoginApproval]) => [
            createUserSuccess({ email: createUserResponse.user.email }),
            ...(data.subscribedToNewsletter
              ? [
                  userNewsletterActions.updateUserNewsletterSubscription({
                    subscriptionStatus: true,
                    userEmail: createUserResponse.user.email,
                  }),
                ]
              : []),
            customerTypeForLoginApproval?.includes(createUserResponse.customer.isBusinessCustomer ? 'SMB' : 'PRIVATE')
              ? createUserApprovalRequired({ email: createUserResponse.user.email })
              : loginUser({ credentials: data.credentials }),
          ]),
          mapErrorToAction(createUserFail)
        )
      )
    )
  );

  redirectAfterUserCreationWithCustomerApproval$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createUserApprovalRequired),
        concatMap(() => from(this.router.navigate(['/register/approval'])))
      ),
    { dispatch: false }
  );

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUser),
      mapToPayload(),
      concatLatestFrom(() => this.store.pipe(select(getLoggedInCustomer))),
      concatMap(([{ user, credentials, successMessage }, customer]) =>
        this.userService.updateUser({ user, customer }, credentials).pipe(
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
      concatLatestFrom(() => this.store.pipe(select(getLoggedInCustomer))),
      concatLatestFrom(() => this.store.pipe(select(getLoggedInUser))),
      concatMap(([[payload, customer], user]) =>
        this.userService.updateUserPassword(customer, user, payload.password, payload.currentPassword).pipe(
          map(() =>
            updateUserPasswordSuccess({
              successMessage: payload.successMessage || { message: 'account.profile.update_password.message' },
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
      concatLatestFrom(() => this.store.pipe(select(getLoggedInCustomer))),
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
        concatLatestFrom(() => this.store.pipe(select(selectUrl))),
        filter(([, url]) => url.includes('/account/profile') || url.includes('/account/organization/settings')),
        concatMap(([, url]) =>
          url.includes('/account/profile')
            ? from(this.router.navigateByUrl('/account/profile'))
            : from(this.router.navigateByUrl('/account/organization/settings'))
        )
      ),
    { dispatch: false }
  );

  displayUpdateUserSuccessMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserPasswordSuccess, updateUserSuccess, updateCustomerSuccess),
      mapToPayloadProperty('successMessage'),
      filter(successMessage => !!successMessage),
      map(displaySuccessMessage)
    )
  );

  resetUserError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      concatLatestFrom(() => this.store.pipe(select(getUserError))),
      filter(([, error]) => !!error),
      map(() => userErrorReset())
    )
  );

  loadCompanyUserAfterLogin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginUserSuccess),
      mapToPayload(),
      filter(payload => payload.customer.isBusinessCustomer),
      map(() => loadCompanyUser())
    )
  );

  loadUserByAPIToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserByAPIToken),
      concatMap(() => this.userService.signInUserByToken().pipe(map(loginUserSuccess), mapErrorToAction(loginUserFail)))
    )
  );

  /**
   * This effect emits the 'personalizationStatusDetermined' action once the PGID is fetched or there is no user apiToken cookie,
   */
  determinePersonalizationStatus$ = createEffect(() =>
    this.store.pipe(
      select(getPGID),
      map(pgid => !this.apiTokenService.hasUserApiTokenCookie() || pgid),
      whenTruthy(),
      delay(100),
      map(() => personalizationStatusDetermined())
    )
  );

  loadUserCostCenters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserCostCenters),
      concatLatestFrom(() => this.store.pipe(select(getLoggedInCustomer))),
      filter(([, loggedInCustomer]) => !!loggedInCustomer && loggedInCustomer.isBusinessCustomer),
      mergeMap(() =>
        this.userService.getEligibleCostCenters().pipe(
          map(costCenters => loadUserCostCentersSuccess({ costCenters })),
          mapErrorToAction(loadUserCostCentersFail)
        )
      )
    )
  );

  loadUserPaymentMethods$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadUserPaymentMethods),
      concatLatestFrom(() => this.store.pipe(select(getLoggedInCustomer))),
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
      mapToPayload(),
      concatLatestFrom(() => this.store.pipe(select(getLoggedInCustomer))),
      filter(([, customer]) => !!customer),
      concatMap(([payload, customer]) =>
        this.paymentService.deleteUserPaymentInstrument(customer.customerNo, payload.id).pipe(
          mergeMap(() => [
            deleteUserPaymentInstrumentSuccess(),
            loadUserPaymentMethods(),
            displaySuccessMessage(payload.successMessage),
          ]),
          mapErrorToAction(deleteUserPaymentInstrumentFail)
        )
      )
    )
  );

  /**
   * Creates a payment instrument for an un-parametrized payment method (like invoice)  and assigns it as preferred instrument at the user.
   * This is necessary due to limitations of the payment user REST interface.
   */
  updatePreferredUserPayment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUserPreferredPayment),
      mapToPayload(),
      concatLatestFrom(() => this.store.pipe(select(getLoggedInCustomer))),
      filter(([, customer]) => !!customer),
      concatMap(([payload, customer]) =>
        this.paymentService
          .createUserPayment(customer.customerNo, { id: undefined, paymentMethod: payload.paymentMethodId })
          .pipe(
            mergeMap(pi => [
              updateUser({
                user: { ...payload.user, preferredPaymentInstrumentId: pi.id },
                successMessage: payload.successMessage,
              }),
              loadUserPaymentMethods(),
            ]),
            mapErrorToAction(updateUserFail)
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
