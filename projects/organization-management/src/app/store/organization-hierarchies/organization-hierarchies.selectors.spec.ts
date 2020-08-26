import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { NodeHelper } from '../../models/node/node.helper';
import { OrganizationManagementStoreModule } from '../organization-management-store.module';

import { loadGroups } from './organization-hierarchies.actions';
import {
  getOrganizationGroups,
  getOrganizationHierarchiesError,
  getOrganizationHierarchiesLoading,
} from './organization-hierarchies.selectors';

describe('Organization Hierarchies Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['configuration']),
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

    it('should not have an error when in initial state', () => {
      expect(getOrganizationHierarchiesError(store$.state)).toBeUndefined();
    });

    it('should not have entities when in initial state', () => {
      expect(getOrganizationGroups(store$.state)).toEqual(NodeHelper.empty());
    });
  });

  describe('LoadOrganizationHierarchies', () => {
    const action = loadGroups();

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getOrganizationHierarchiesLoading(store$.state)).toBeTrue();
    });
  });
});
