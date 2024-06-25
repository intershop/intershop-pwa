import { TestBed } from '@angular/core/testing';

import { User } from 'ish-core/models/user/user.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { loadCustomerUsers, loadCustomerUsersFail, loadCustomerUsersSuccess } from './users.actions';
import { getUsers } from './users.selectors';

describe('Users Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(['serverConfig']), CustomerStoreModule.forTesting('users')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not have entities when in initial state', () => {
      expect(getUsers(store$.state)).toBeEmpty();
    });
  });

  describe('LoadUsers', () => {
    const action = loadCustomerUsers();

    beforeEach(() => {
      store$.dispatch(action);
    });

    describe('LoadCustomerUsersSuccess', () => {
      const users = [
        { login: '1' },
        { login: '2', roleIDs: ['APP_B2B_ACCOUNT_OWNER'] },
        { login: '3', roleIDs: ['APP_B2B_OCI_USER'] },
        { login: '3', roleIDs: ['APP_B2B_CXML_USER'] },
        { login: '4', roleIDs: ['APP_B2B_COSTCENTER_OWNER'] },
      ] as User[];
      const successAction = loadCustomerUsersSuccess({ users });

      beforeEach(() => {
        store$.dispatch(successAction);
      });

      it('should have entities when successfully loading', () => {
        expect(getUsers(store$.state)).toHaveLength(3);
      });
    });

    describe('LoadCustomerUsersFail', () => {
      const error = makeHttpError({ message: 'ERROR' });
      const failAction = loadCustomerUsersFail({ error });

      beforeEach(() => {
        store$.dispatch(failAction);
      });

      it('should not have entities when reducing error', () => {
        expect(getUsers(store$.state)).toBeEmpty();
      });
    });
  });
});
