import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { switchMap, take, tap } from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { Contact } from 'ish-core/models/contact/contact.model';
import { Credentials } from 'ish-core/models/credentials/credentials.model';
import { Customer, CustomerRegistrationType } from 'ish-core/models/customer/customer.model';
import { PasswordReminderUpdate } from 'ish-core/models/password-reminder-update/password-reminder-update.model';
import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';
import { User } from 'ish-core/models/user/user.model';
import {
  CreateCustomerAddress,
  DeleteCustomerAddress,
  LoadAddresses,
  getAddressesError,
  getAddressesLoading,
  getAllAddresses,
} from 'ish-core/store/account/addresses';
import { LoadOrders, getOrders, getOrdersLoading, getSelectedOrder } from 'ish-core/store/account/orders';
import {
  CreateUser,
  DeleteUserPaymentInstrument,
  LoadUserPaymentMethods,
  LoginUser,
  RequestPasswordReminder,
  ResetPasswordReminder,
  UpdateCustomer,
  UpdateUser,
  UpdateUserPassword,
  UpdateUserPasswordByPasswordReminder,
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
} from 'ish-core/store/account/user';
import {
  CreateContact,
  LoadContact,
  getContactLoading,
  getContactSubjects,
  getContactSuccess,
} from 'ish-core/store/general/contact';
import { whenTruthy } from 'ish-core/utils/operators';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class AccountFacade {
  constructor(private store: Store) {}

  // USER
  user$ = this.store.pipe(select(getLoggedInUser));
  userError$ = this.store.pipe(select(getUserError));
  userLoading$ = this.store.pipe(select(getUserLoading));
  isLoggedIn$ = this.store.pipe(select(getUserAuthorized));

  loginUser(credentials: Credentials) {
    this.store.dispatch(new LoginUser({ credentials }));
  }

  createUser(body: CustomerRegistrationType) {
    this.store.dispatch(new CreateUser(body));
  }

  updateUser(user: User, successMessage?: string, successRouterLink?: string) {
    this.store.dispatch(new UpdateUser({ user, successMessage, successRouterLink }));
  }

  updateUserEmail(user: User) {
    this.store.dispatch(
      new UpdateUser({
        user,
        successMessage: 'account.profile.update_email.message',
        successRouterLink: '/account/profile',
      })
    );
  }

  updateUserPassword(data: { password: string; currentPassword: string }) {
    this.store.dispatch(new UpdateUserPassword(data));
  }

  updateUserProfile(user: User) {
    this.store.dispatch(
      new UpdateUser({
        user,
        successMessage: 'account.profile.update_profile.message',
        successRouterLink: '/account/profile',
      })
    );
  }

  // CUSTOMER
  customer$ = this.store.pipe(select(getLoggedInCustomer));
  isBusinessCustomer$ = this.store.pipe(select(isBusinessCustomer));
  userPriceDisplayType$ = this.store.pipe(select(getPriceDisplayType));

  updateCustomerProfile(customer: Customer, message?: string) {
    this.store.dispatch(
      new UpdateCustomer({
        customer,
        successMessage: message ? message : 'account.profile.update_profile.message',
        successRouterLink: '/account/profile',
      })
    );
  }

  // PASSWORD
  passwordReminderSuccess$ = this.store.pipe(select(getPasswordReminderSuccess));
  passwordReminderError$ = this.store.pipe(select(getPasswordReminderError));

  resetPasswordReminder() {
    this.store.dispatch(new ResetPasswordReminder());
  }

  requestPasswordReminder(data: PasswordReminder) {
    this.store.dispatch(new RequestPasswordReminder({ data }));
  }

  requestPasswordReminderUpdate(data: PasswordReminderUpdate) {
    this.store.dispatch(new UpdateUserPasswordByPasswordReminder(data));
  }

  // ORDERS
  orders$() {
    this.store.dispatch(new LoadOrders());
    return this.store.pipe(select(getOrders));
  }

  selectedOrder$ = this.store.pipe(select(getSelectedOrder));
  ordersLoading$ = this.store.pipe(select(getOrdersLoading));

  // PAYMENT
  private eligiblePaymentMethods$ = this.store.pipe(select(getUserPaymentMethods));

  paymentMethods$() {
    this.store.dispatch(new LoadUserPaymentMethods());
    return this.eligiblePaymentMethods$;
  }

  deletePaymentInstrument(paymentInstrumentId: string) {
    this.store.dispatch(new DeleteUserPaymentInstrument({ id: paymentInstrumentId }));
  }

  // ADDRESSES
  addresses$() {
    return this.user$.pipe(
      whenTruthy(),
      take(1),
      tap(() => this.store.dispatch(new LoadAddresses())),
      switchMap(() => this.store.pipe(select(getAllAddresses)))
    );
  }
  addressesLoading$ = this.store.pipe(select(getAddressesLoading));
  addressesError$ = this.store.pipe(select(getAddressesError));

  createCustomerAddress(address: Address) {
    this.store.dispatch(new CreateCustomerAddress({ address }));
  }

  deleteCustomerAddress(addressId: string) {
    this.store.dispatch(new DeleteCustomerAddress({ addressId }));
  }

  // CONTACT US
  contactSubjects$() {
    this.store.dispatch(new LoadContact());
    return this.store.pipe(select(getContactSubjects));
  }
  contactLoading$ = this.store.pipe(select(getContactLoading));
  contactSuccess$ = this.store.pipe(select(getContactSuccess));

  resetContactState() {
    this.store.dispatch(new LoadContact());
  }
  createContact(contact: Contact) {
    this.store.dispatch(new CreateContact({ contact }));
  }
}
