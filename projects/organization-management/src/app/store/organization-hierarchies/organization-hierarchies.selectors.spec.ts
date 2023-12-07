import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { Group } from '../../models/group/group.model';
import { OrganizationManagementStoreModule } from '../organization-management-store.module';

import { loadGroups, loadGroupsFail, loadGroupsSuccess } from './organization-hierarchies.actions';
import {
  getGroups,
  getOrganizationGroupsError,
  getOrganizationGroupsLoading,
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
      expect(getOrganizationGroupsLoading(store$.state)).toBeFalse();
    });

    it('should not have an error when in initial state', () => {
      expect(getOrganizationGroupsError(store$.state)).toBeUndefined();
    });

    it('should not have entities when in initial state', () => {
      expect(getGroups(store$.state)).toBeEmpty();
    });
  });

  describe('LoadOrganizationHierarchies', () => {
    const action = loadGroups();

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getOrganizationGroupsLoading(store$.state)).toBeTrue();
    });

    describe('LoadOrganizationHierarchiesSuccess', () => {
      const groups = [
        {
          id: 'test',
          name: 'Test Group',
        } as Group,
      ];

      const successAction = loadGroupsSuccess({ groups });

      beforeEach(() => {
        store$.dispatch(successAction);
      });

      it('should set loading to false', () => {
        expect(getOrganizationGroupsLoading(store$.state)).toBeFalse();
      });

      it('should not have an error when successfully loaded groups', () => {
        expect(getOrganizationGroupsError(store$.state)).toBeUndefined();
      });

      it('should have a group object when successfully loading', () => {
        const loadedTree = getGroups(store$.state);
        expect(loadedTree).not.toBeUndefined();
        expect(loadedTree[0]).toHaveProperty('id', 'test');
        expect(loadedTree[0]).toHaveProperty('name', 'Test Group');
      });
    });

    describe('LoadOrganizationHierarchiesFail', () => {
      const error = makeHttpError({ message: 'ERROR' });
      const failAction = loadGroupsFail({ error });

      beforeEach(() => {
        store$.dispatch(failAction);
      });

      it('should set loading to false', () => {
        expect(getOrganizationGroupsLoading(store$.state)).toBeFalse();
      });

      it('should have an error when reducing', () => {
        expect(getOrganizationGroupsError(store$.state)).toBeTruthy();
      });

      it('should not have a group object when reducing error', () => {
        const loadedTree = getGroups(store$.state);
        expect(loadedTree).not.toBeUndefined();
        expect(loadedTree).toBeEmpty();
      });
    });
  });
});
