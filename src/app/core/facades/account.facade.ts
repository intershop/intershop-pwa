import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Subject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { Contact } from 'ish-core/models/contact/contact.model';
import { Credentials } from 'ish-core/models/credentials/credentials.model';
import { Customer, CustomerRegistrationType } from 'ish-core/models/customer/customer.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PasswordReminderUpdate } from 'ish-core/models/password-reminder-update/password-reminder-update.model';
import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';
import { User } from 'ish-core/models/user/user.model';
import { MessagesPayloadType } from 'ish-core/store/core/messages';
import {
  createCustomerAddress,
  deleteCustomerAddress,
  getAddressesError,
  getAddressesLoading,
  getAllAddresses,
  loadAddresses,
} from 'ish-core/store/customer/addresses';
import { getUserRoles } from 'ish-core/store/customer/authorization';
import { getOrders, getOrdersLoading, getSelectedOrder, loadOrders } from 'ish-core/store/customer/orders';
import { getSsoRegistrationError } from 'ish-core/store/customer/sso-registration';
import {
  createUser,
  deleteUserPaymentInstrument,
  getLoggedInCustomer,
  getLoggedInUser,
  getPasswordReminderError,
  getPasswordReminderSuccess,
  getPriceDisplayType,
  getUserAuthorized,
  getUserError,
  getUserLoading,
  getUserPaymentMethods,
  isBusinessCustomer,
  loadUserPaymentMethods,
  loginUser,
  loginUserWithToken,
  logoutUser,
  requestPasswordReminder,
  resetPasswordReminder,
  updateCustomer,
  updateUser,
  updateUserPassword,
  updateUserPasswordByPasswordReminder,
} from 'ish-core/store/customer/user';
import {
  createContact,
  getContactLoading,
  getContactSubjects,
  getContactSuccess,
  loadContact,
} from 'ish-core/store/general/contact';
import { whenTruthy } from 'ish-core/utils/operators';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class AccountFacade {
  /**
   * internal subject so error can only be subscribed to once
   */
  private internalUserError$ = new Subject<HttpError>();

  constructor(private store: Store) {
    store.pipe(select(getUserError)).subscribe(this.internalUserError$);
  }

  // USER

  user$ = this.store.pipe(select(getLoggedInUser));
  userEmail$ = this.user$.pipe(map(user => user?.email));
  userError$ = this.internalUserError$.asObservable();
  userLoading$ = this.store.pipe(select(getUserLoading));
  isLoggedIn$ = this.store.pipe(select(getUserAuthorized));
  roles$ = this.store.pipe(select(getUserRoles));
  ssoRegistrationError$ = this.store.pipe(select(getSsoRegistrationError));

  loginUser(credentials: Credentials) {
    this.store.dispatch(loginUser({ credentials }));
  }

  loginUserWithToken(token: string) {
    this.store.dispatch(loginUserWithToken({ token }));
  }

  logoutUser() {
    this.store.dispatch(logoutUser());
  }

  createUser(body: CustomerRegistrationType) {
    this.store.dispatch(createUser(body));
  }

  updateUser(user: User, successMessage?: MessagesPayloadType) {
    this.store.dispatch(updateUser({ user, successMessage }));
  }

  updateUserEmail(user: User, credentials: Credentials) {
    this.store.dispatch(
      updateUser({
        user,
        credentials,
        successMessage: { message: 'account.profile.update_email.message', messageParams: { 0: user.email } },
      })
    );
  }

  updateUserPassword(data: { password: string; currentPassword: string }) {
    this.store.dispatch(updateUserPassword(data));
  }

  updateUserProfile(user: User) {
    this.store.dispatch(updateUser({ user, successMessage: { message: 'account.profile.update_profile.message' } }));
  }

  // CUSTOMER

  customer$ = this.store.pipe(select(getLoggedInCustomer));
  isBusinessCustomer$ = this.store.pipe(select(isBusinessCustomer));
  userPriceDisplayType$ = this.store.pipe(select(getPriceDisplayType));

  updateCustomerProfile(customer: Customer, message?: MessagesPayloadType) {
    this.store.dispatch(
      updateCustomer({
        customer,
        successMessage: message ? message : { message: 'account.profile.update_profile.message' },
      })
    );
  }

  // PASSWORD

  passwordReminderSuccess$ = this.store.pipe(select(getPasswordReminderSuccess));
  passwordReminderError$ = this.store.pipe(select(getPasswordReminderError));

  resetPasswordReminder() {
    this.store.dispatch(resetPasswordReminder());
  }

  requestPasswordReminder(data: PasswordReminder) {
    this.store.dispatch(requestPasswordReminder({ data }));
  }

  requestPasswordReminderUpdate(data: PasswordReminderUpdate) {
    this.store.dispatch(updateUserPasswordByPasswordReminder(data));
  }

  // ORDERS

  orders$() {
    this.store.dispatch(loadOrders());
    return this.store.pipe(select(getOrders));
  }

  selectedOrder$ = this.store.pipe(select(getSelectedOrder));
  ordersLoading$ = this.store.pipe(select(getOrdersLoading));

  // PAYMENT

  private eligiblePaymentMethods$ = this.store.pipe(select(getUserPaymentMethods));

  paymentMethods$() {
    this.store.dispatch(loadUserPaymentMethods());
    return this.eligiblePaymentMethods$;
  }

  deletePaymentInstrument(paymentInstrumentId: string) {
    this.store.dispatch(deleteUserPaymentInstrument({ id: paymentInstrumentId }));
  }

  // ADDRESSES

  addresses$() {
    return this.user$.pipe(
      whenTruthy(),
      take(1),
      tap(() => this.store.dispatch(loadAddresses())),
      switchMap(() => this.store.pipe(select(getAllAddresses)))
    );
  }
  addressesLoading$ = this.store.pipe(select(getAddressesLoading));
  addressesError$ = this.store.pipe(select(getAddressesError));

  createCustomerAddress(address: Address) {
    this.store.dispatch(createCustomerAddress({ address }));
  }

  deleteCustomerAddress(addressId: string) {
    this.store.dispatch(deleteCustomerAddress({ addressId }));
  }

  // CONTACT US

  contactSubjects$() {
    this.store.dispatch(loadContact());
    return this.store.pipe(select(getContactSubjects));
  }
  contactLoading$ = this.store.pipe(select(getContactLoading));
  contactSuccess$ = this.store.pipe(select(getContactSuccess));

  resetContactState() {
    this.store.dispatch(loadContact());
  }
  createContact(contact: Contact) {
    this.store.dispatch(createContact({ contact }));
  }
}
