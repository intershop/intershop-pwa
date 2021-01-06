import { TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { cold } from 'jest-marbles';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loadRolesAndPermissionsSuccess } from 'ish-core/store/customer/authorization';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';

import { AuthorizationToggleService } from './authorization-toggle.service';

describe('Authorization Toggle Service', () => {
  let store$: Store;
  let authorizationToggleService: AuthorizationToggleService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), CustomerStoreModule.forTesting('authorization')],
    });

    store$ = TestBed.inject(Store);
    store$.dispatch(loadRolesAndPermissionsSuccess({ authorization: { roles: [], permissionIDs: ['DO_THIS'] } }));

    authorizationToggleService = TestBed.inject(AuthorizationToggleService);
  });

  describe('isAuthorizedTo', () => {
    it('should return true if user has permission', () => {
      expect(authorizationToggleService.isAuthorizedTo('DO_THIS')).toBeObservable(cold('a', { a: true }));
    });

    it("should return false if user doesn't have permission", () => {
      expect(authorizationToggleService.isAuthorizedTo('DO_THAT')).toBeObservable(cold('a', { a: false }));
    });

    it('should return shortcut true for permission "always"', () => {
      expect(authorizationToggleService.isAuthorizedTo('always')).toBeObservable(cold('(a|)', { a: true }));
    });

    it('should return shortcut false for permission "never"', () => {
      expect(authorizationToggleService.isAuthorizedTo('never')).toBeObservable(cold('(a|)', { a: false }));
    });
  });
});
