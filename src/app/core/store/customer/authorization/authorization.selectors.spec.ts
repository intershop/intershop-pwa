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
      expect(getUserPermissions(store$.state)).toBeEmpty();
    });
  });

  describe('after successfully loading roles and permissions', () => {
    const action = loadRolesAndPermissionsSuccess({
      authorization: {
        roleDisplayNames: ['Buyer', 'Approver'],
        permissionIDs: ['A', 'C'],
      },
    });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getUserRoles(store$.state)).toIncludeSameMembers(['Buyer', 'Approver']);
      expect(getUserPermissions(store$.state)).toIncludeSameMembers(['A', 'C']);
    });
  });
});
