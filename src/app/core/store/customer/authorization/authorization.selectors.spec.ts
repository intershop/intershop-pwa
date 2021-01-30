import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { loadRolesAndPermissionsSuccess } from './authorization.actions';
import { getUserPermissions, getUserRoles } from './authorization.selectors';

describe('Authorization Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), CustomerStoreModule.forTesting('authorization')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getUserRoles(store$.state)).toBeEmpty();
      expect(getUserPermissions(store$.state)).toBeUndefined();
    });
  });

  describe('after successfully loading roles and permissions', () => {
    const action = loadRolesAndPermissionsSuccess({
      authorization: {
        roles: [
          { displayName: 'Buyer', roleId: 'APP_B2B_Buyer' },
          { displayName: 'Approver', roleId: 'APP_B2B_Approver' },
        ],
        permissionIDs: ['A', 'C'],
      },
    });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getUserRoles(store$.state)).toIncludeSameMembers([
        { displayName: 'Buyer', roleId: 'APP_B2B_Buyer' },
        { displayName: 'Approver', roleId: 'APP_B2B_Approver' },
      ]);
      expect(getUserPermissions(store$.state)).toIncludeSameMembers(['A', 'C']);
    });
  });
});
