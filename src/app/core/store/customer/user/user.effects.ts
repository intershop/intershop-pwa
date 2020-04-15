import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { EMPTY, merge, of, race, timer } from 'rxjs';
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
import { HttpErrorMapper } from 'ish-core/models/http-error/http-error.mapper';
import { PaymentService } from 'ish-core/services/payment/payment.service';
import { PersonalizationService } from 'ish-core/services/personalization/personalization.service';
import { UserService } from 'ish-core/services/user/user.service';
import { GeneralError } from 'ish-core/store/core/error';
import { DisplaySuccessMessage } from 'ish-core/store/core/messages';
import { ofUrl, selectQueryParam } from 'ish-core/store/core/router';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import {
  CreateUser,
  CreateUserFail,
  DeleteUserPaymentInstrument,
  DeleteUserPaymentInstrumentFail,
  DeleteUserPaymentInstrumentSuccess,
  LoadCompanyUser,
  LoadCompanyUserFail,
  LoadCompanyUserSuccess,
  LoadUserByAPIToken,
  LoadUserPaymentMethods,
  LoadUserPaymentMethodsFail,
  LoadUserPaymentMethodsSuccess,
  LoginUser,
  LoginUserFail,
  LoginUserSuccess,
  RequestPasswordReminder,
  RequestPasswordReminderFail,
  RequestPasswordReminderSuccess,
  SetPGID,
  UpdateCustomer,
  UpdateCustomerFail,
  UpdateCustomerSuccess,
  UpdateUser,
  UpdateUserFail,
  UpdateUserPassword,
  UpdateUserPasswordByPasswordReminder,
  UpdateUserPasswordByPasswordReminderFail,
  UpdateUserPasswordByPasswordReminderSuccess,
  UpdateUserPasswordFail,
  UpdateUserPasswordSuccess,
  UpdateUserSuccess,
  UserActionTypes,
  UserErrorReset,
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

  @Effect()
  loginUser$ = this.actions$.pipe(
    ofType<LoginUser>(UserActionTypes.LoginUser),
    mapToPayloadProperty('credentials'),
    exhaustMap(credentials =>
      this.userService.signinUser(credentials).pipe(
        map(data => new LoginUserSuccess(data)),
        // tslint:disable-next-line:ban
        catchError(error =>
          of(
            error.headers.has('error-key')
              ? new LoginUserFail({ error: HttpErrorMapper.fromError(error) })
              : new GeneralError({ error: HttpErrorMapper.fromError(error) })
          )
        )
      )
    )
  );

  @Effect()
  loadCompanyUser$ = this.actions$.pipe(
    ofType(UserActionTypes.LoadCompanyUser),
    mergeMap(() =>
      this.userService.getCompanyUserData().pipe(
        map(user => new LoadCompanyUserSuccess({ user })),
        mapErrorToAction(LoadCompanyUserFail)
      )
    )
  );

  @Effect({ dispatch: false })
  goToLoginAfterLogoutBySessionTimeout$ = this.actions$.pipe(
    ofType(UserActionTypes.ResetAPIToken),
    switchMapTo(
      race(
        // wait for immediate LogoutUser
        this.actions$.pipe(ofType(UserActionTypes.LogoutUser)),
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
  );

  /**
   * redirects to the returnUrl after successful login
   * does not redirect at all, if no returnUrl is defined
   */
  @Effect({ dispatch: false })
  redirectAfterLogin$ = merge(
    this.actions$.pipe(
      ofType(UserActionTypes.LoginUserSuccess),
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
  );

  @Effect()
  createUser$ = this.actions$.pipe(
    ofType<CreateUser>(UserActionTypes.CreateUser),
    mapToPayload(),
    mergeMap((data: CustomerRegistrationType) =>
      this.userService.createUser(data).pipe(
        // TODO:see #IS-22750 - user should actually be logged in after registration
        map(() => new LoginUser({ credentials: data.credentials })),
        // tslint:disable-next-line:ban
        catchError(error =>
          of(
            error.headers.has('error-key')
              ? new CreateUserFail({ error: HttpErrorMapper.fromError(error) })
              : new GeneralError({ error: HttpErrorMapper.fromError(error) })
          )
        )
      )
    )
  );

  @Effect()
  updateUser$ = this.actions$.pipe(
    ofType<UpdateUser>(UserActionTypes.UpdateUser),
    mapToPayload(),
    withLatestFrom(this.store$.pipe(select(getLoggedInCustomer))),
    concatMap(([payload, customer]) =>
      this.userService.updateUser({ user: payload.user, customer }).pipe(
        tap(() => {
          if (payload.successRouterLink) {
            this.router.navigateByUrl(payload.successRouterLink);
          }
        }),
        map(changedUser => new UpdateUserSuccess({ user: changedUser, successMessage: payload.successMessage })),
        mapErrorToAction(UpdateUserFail)
      )
    )
  );

  @Effect()
  updateUserPassword$ = this.actions$.pipe(
    ofType<UpdateUserPassword>(UserActionTypes.UpdateUserPassword),
    mapToPayload(),
    withLatestFrom(this.store$.pipe(select(getLoggedInCustomer))),
    withLatestFrom(this.store$.pipe(select(getLoggedInUser))),
    concatMap(([[payload, customer], user]) =>
      this.userService.updateUserPassword(customer, user, payload.password, payload.currentPassword).pipe(
        tap(() => this.router.navigateByUrl('/account/profile')),
        mapTo(
          new UpdateUserPasswordSuccess({
            successMessage: payload.successMessage || 'account.profile.update_password.message',
          })
        ),
        mapErrorToAction(UpdateUserPasswordFail)
      )
    )
  );

  @Effect()
  updateCustomer$ = this.actions$.pipe(
    ofType<UpdateCustomer>(UserActionTypes.UpdateCustomer),
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
            new UpdateCustomerSuccess({ customer: changedCustomer, successMessage: payload.successMessage })
        ),
        mapErrorToAction(UpdateCustomerFail)
      )
    )
  );

  @Effect()
  displayUpdateUserSuccessMessage$ = this.actions$.pipe(
    ofType(
      UserActionTypes.UpdateUserPasswordSuccess,
      UserActionTypes.UpdateUserSuccess,
      UserActionTypes.UpdateCustomerSuccess
    ),
    mapToPayloadProperty('successMessage'),
    filter(successMessage => !!successMessage),
    map(
      successMessage =>
        new DisplaySuccessMessage({
          message: successMessage,
        })
    )
  );

  @Effect()
  resetUserError$ = this.actions$.pipe(
    ofType(routerNavigatedAction),
    withLatestFrom(this.store$.pipe(select(getUserError))),
    filter(([, error]) => !!error),
    mapTo(new UserErrorReset())
  );

  @Effect()
  loadCompanyUserAfterLogin$ = this.actions$.pipe(
    ofType<LoginUserSuccess>(UserActionTypes.LoginUserSuccess),
    mapToPayload(),
    filter(payload => payload.customer.isBusinessCustomer),
    mapTo(new LoadCompanyUser())
  );

  @Effect()
  loadUserByAPIToken$ = this.actions$.pipe(
    ofType<LoadUserByAPIToken>(UserActionTypes.LoadUserByAPIToken),
    mapToPayloadProperty('apiToken'),
    concatMap(apiToken => this.userService.signinUserByToken(apiToken).pipe(map(user => new LoginUserSuccess(user))))
  );

  @Effect()
  fetchPGID$ = this.actions$.pipe(
    ofType(UserActionTypes.LoginUserSuccess),
    switchMap(() =>
      this.personalizationService.getPGID().pipe(
        map(pgid => new SetPGID({ pgid })),
        // tslint:disable-next-line:ban
        catchError(() => EMPTY)
      )
    )
  );

  @Effect()
  loadUserPaymentMethods$ = this.actions$.pipe(
    ofType<LoadUserPaymentMethods>(UserActionTypes.LoadUserPaymentMethods),
    withLatestFrom(this.store$.pipe(select(getLoggedInCustomer))),
    filter(([, customer]) => !!customer),
    concatMap(([, customer]) =>
      this.paymentService.getUserPaymentMethods(customer).pipe(
        map(result => new LoadUserPaymentMethodsSuccess({ paymentMethods: result })),
        mapErrorToAction(LoadUserPaymentMethodsFail)
      )
    )
  );

  @Effect()
  deleteUserPayment$ = this.actions$.pipe(
    ofType<DeleteUserPaymentInstrument>(UserActionTypes.DeleteUserPaymentInstrument),
    mapToPayloadProperty('id'),
    withLatestFrom(this.store$.pipe(select(getLoggedInCustomer))),
    filter(([, customer]) => !!customer),
    concatMap(([id, customer]) =>
      this.paymentService.deleteUserPaymentInstrument(customer.customerNo, id).pipe(
        concatMapTo([
          new DeleteUserPaymentInstrumentSuccess(),
          new LoadUserPaymentMethods(),
          new DisplaySuccessMessage({
            message: 'account.payment.payment_deleted.message',
          }),
        ]),
        mapErrorToAction(DeleteUserPaymentInstrumentFail)
      )
    )
  );

  @Effect()
  requestPasswordReminder$ = this.actions$.pipe(
    ofType<RequestPasswordReminder>(UserActionTypes.RequestPasswordReminder),
    mapToPayloadProperty('data'),
    concatMap(data =>
      this.userService.requestPasswordReminder(data).pipe(
        map(() => new RequestPasswordReminderSuccess()),
        mapErrorToAction(RequestPasswordReminderFail)
      )
    )
  );

  @Effect()
  updateUserPasswordByPasswordReminder$ = this.actions$.pipe(
    ofType<UpdateUserPasswordByPasswordReminder>(UserActionTypes.UpdateUserPasswordByPasswordReminder),
    mapToPayload(),
    concatMap(data =>
      this.userService.updateUserPasswordByReminder(data).pipe(
        map(() => new UpdateUserPasswordByPasswordReminderSuccess()),
        mapErrorToAction(UpdateUserPasswordByPasswordReminderFail)
      )
    )
  );

  @Effect()
  updateUserPasswordByPasswordReminderSuccess$ = this.actions$.pipe(
    ofType<UpdateUserPasswordByPasswordReminderSuccess>(UserActionTypes.UpdateUserPasswordByPasswordReminderSuccess),
    map(
      () =>
        new DisplaySuccessMessage({
          message: 'account.profile.update_password.message',
        })
    )
  );
}
