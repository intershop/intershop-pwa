import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Customer } from '../../../models/customer/customer.model';
import { PrivateCustomer } from '../../../models/customer/private-customer.model';
import { SmbCustomerUser } from '../../../models/customer/smb-customer-user.model';
import { CoreState } from '../core.state';
import { coreReducers } from '../core.system';
import { LoadCompanyUserSuccess, LoginUserFail, LoginUserSuccess } from './user.actions';
import { getLoggedInCustomer, getLoggedInUser, getUserAuthorized, getUserError } from './user.selectors';

describe('User State Selectors', () => {
  let store: Store<CoreState>;

  let userAuthorized$: Observable<boolean>;
  let loggedInCustomer$: Observable<Customer>;
  let loggedInUser$: Observable<PrivateCustomer | SmbCustomerUser>;
  let loginError$: Observable<HttpErrorResponse>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot(coreReducers)],
    });

    store = TestBed.get(Store);

    userAuthorized$ = store.pipe(select(getUserAuthorized));
    loggedInCustomer$ = store.pipe(select(getLoggedInCustomer));
    loggedInUser$ = store.pipe(select(getLoggedInUser));
    loginError$ = store.pipe(select(getUserError));
  });

  it('should select no customer/user when no event was sent', () => {
    userAuthorized$.subscribe(authorized => expect(authorized).toBe(false));
    loggedInCustomer$.subscribe(customer => expect(customer).toBe(null));
    loggedInUser$.subscribe(user => expect(user).toBe(null));
    loginError$.subscribe(error => expect(error).toBeFalsy());
  });

  it('should select the customer when logging in successfully', () => {
    const customerNo = 'test';
    store.dispatch(new LoginUserSuccess({ customerNo } as Customer));

    userAuthorized$.subscribe(authorized => expect(authorized).toBe(true));
    loggedInCustomer$.subscribe(customer => {
      expect(customer).toBeTruthy();
      expect((customer as Customer).customerNo).toEqual(customerNo);
    });
    loginError$.subscribe(error => expect(error).toBeFalsy());
  });

  it('should select the user when logging in as private customer successfully', () => {
    const firstName = 'test';
    const type = 'PrivateCustomer';
    store.dispatch(new LoginUserSuccess({ firstName, type } as PrivateCustomer));

    userAuthorized$.subscribe(authorized => expect(authorized).toBe(true));
    loggedInUser$.subscribe(user => {
      expect(user).toBeTruthy();
      expect((user as PrivateCustomer).firstName).toEqual(firstName);
    });
    loginError$.subscribe(error => expect(error).toBeFalsy());
  });

  it('should not select the user when logging in as company customer successfully', () => {
    const type = 'SMBCustomer';
    store.dispatch(new LoginUserSuccess({ type } as PrivateCustomer));

    userAuthorized$.subscribe(authorized => expect(authorized).toBe(true));
    loggedInUser$.subscribe(user => {
      expect(user).toBeNull();
    });
    loginError$.subscribe(error => expect(error).toBeFalsy());
  });

  it('should select the user when load company user is successful', () => {
    const firstName = 'test';
    const type = 'PrivateCustomer';
    store.dispatch(new LoadCompanyUserSuccess({ firstName, type } as SmbCustomerUser));

    loggedInUser$.subscribe(user => {
      expect(user).toBeTruthy();
      expect((user as SmbCustomerUser).firstName).toEqual(firstName);
    });
    loginError$.subscribe(error => expect(error).toBeFalsy());
  });

  it('should select no customer and an error when an error event was sent', () => {
    const error = { status: 401, headers: new HttpHeaders().set('error-key', 'dummy') } as HttpErrorResponse;
    store.dispatch(new LoginUserFail(error));

    userAuthorized$.subscribe(authorized => expect(authorized).toBe(false));
    loggedInUser$.subscribe(customer => expect(customer).toBe(null));
    loginError$.subscribe(err => {
      expect(err).toBeTruthy();
      expect(err.headers.get('error-key')).toBe('dummy');
    });
  });
});
