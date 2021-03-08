import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { cold } from 'jest-marbles';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadRolesAndPermissionsSuccess } from 'ish-core/store/customer/authorization';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';

import { RoleToggleService } from './role-toggle.service';

describe('Role Toggle Service', () => {
  let store$: Store;
  let roleToggleService: RoleToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), CustomerStoreModule.forTesting('authorization')],
    });

    store$ = TestBed.inject(Store);
    store$.dispatch(
      loadRolesAndPermissionsSuccess({
        authorization: { roles: [{ roleId: 'ROLE1', displayName: 'Role 1' }], permissionIDs: [] },
      })
    );

    roleToggleService = TestBed.inject(RoleToggleService);
  });

  describe('hasRole', () => {
    it('should return true if user has the role', () => {
      expect(roleToggleService.hasRole('ROLE1')).toBeObservable(cold('a', { a: true }));
    });

    it("should return false if user doesn't have the role", () => {
      expect(roleToggleService.hasRole('ROLE2')).toBeObservable(cold('a', { a: false }));
    });

    it('should return true if user has one of the roles', () => {
      expect(roleToggleService.hasRole(['ROLE1', 'ROLE3'])).toBeObservable(cold('a', { a: true }));
    });

    it("should return false if user doesn't have one the roles", () => {
      expect(roleToggleService.hasRole(['ROLE2', 'ROLE3'])).toBeObservable(cold('a', { a: false }));
    });
  });
});
