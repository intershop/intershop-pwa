import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { OrganizationManagementStoreModule } from '../organization-management-store.module';

import { loadOrganizationHierarchies } from './organization-hierarchies.actions';
import { getOrganizationHierarchiesLoading } from './organization-hierarchies.selectors';

describe('Organization Hierarchies Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['organizationHierarchies']),
        OrganizationManagementStoreModule.forTesting('organizationHierarchies'),
      ],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getOrganizationHierarchiesLoading(store$.state)).toBeFalse();
    });
  });

  describe('LoadOrganizationHierarchies', () => {
    const action = loadOrganizationHierarchies();

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getOrganizationHierarchiesLoading(store$.state)).toBeTrue();
    });
  });
});
