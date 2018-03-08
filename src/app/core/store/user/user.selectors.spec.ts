import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { select, Store, StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { Customer } from '../../../models/customer/customer.model';
import { CoreState } from '../core.state';
import { reducers } from '../core.system';
import { LoginUserFail, LoginUserSuccess } from './user.actions';
import { getLoggedInUser, getLoginError, getUserAuthorized } from './user.selectors';

describe('User State Selectors', () => {

  let store: Store<CoreState>;

  let userAuthorized$: Observable<boolean>;
  let loggedInUser$: Observable<Customer>;
  let loginError$: Observable<HttpErrorResponse>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot(reducers),
      ],
    });

    store = TestBed.get(Store);

    userAuthorized$ = store.pipe(select(getUserAuthorized));
    loggedInUser$ = store.pipe(select(getLoggedInUser));
    loginError$ = store.pipe(select(getLoginError));
  });

  it('should select no customer when no event was sent', () => {
    userAuthorized$.subscribe(authorized =>
      expect(authorized).toBe(false)
    );
    loggedInUser$.subscribe(customer =>
      expect(customer).toBe(null)
    );
    loginError$.subscribe(error =>
      expect(error).toBeFalsy()
    );
  });

  it('should select the customer when logging in successfully', () => {
    const name = 'dummy';
    store.dispatch(new LoginUserSuccess({ name } as any));

    userAuthorized$.subscribe(authorized =>
      expect(authorized).toBe(true)
    );
    loggedInUser$.subscribe(customer => {
      expect(customer).toBeTruthy();
      expect((customer as any).name).toEqual(name);
    });
    loginError$.subscribe(error =>
      expect(error).toBeFalsy()
    );
  });

  it('should select no customer and an error when an error event was sent', () => {
    const error: any = { message: 'dummy' };
    store.dispatch(new LoginUserFail(error));

    userAuthorized$.subscribe(authorized =>
      expect(authorized).toBe(false)
    );
    loggedInUser$.subscribe(customer =>
      expect(customer).toBe(null)
    );
    loginError$.subscribe(err => {
      expect(err).toBeTruthy();
      expect(err.message).toBe('dummy');
    });
  });
});
