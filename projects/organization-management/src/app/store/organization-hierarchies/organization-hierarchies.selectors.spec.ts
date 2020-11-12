import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { NodeHelper } from '../../models/node/node.helper';
import { Node } from '../../models/node/node.model';
import { OrganizationManagementStoreModule } from '../organization-management-store.module';

import { loadGroups, loadGroupsFail, loadGroupsSuccess } from './organization-hierarchies.actions';
import {
  getOrganizationGroups,
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
      expect(getOrganizationGroups(store$.state)).toEqual(NodeHelper.empty());
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
      const nodeTree = NodeHelper.empty();
      nodeTree.nodes = {
        test: {
          id: 'test',
          name: 'Test Node',
        } as Node,
      };
      nodeTree.rootIds = ['test'];
      const successAction = loadGroupsSuccess({ nodeTree });

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
        const loadedTree = getOrganizationGroups(store$.state);
        expect(loadedTree).not.toBeUndefined();
        expect(loadedTree.rootIds).toContain('test');
        expect(loadedTree.edges).toBeEmpty();
        expect(loadedTree.nodes.test).toHaveProperty('id', 'test');
        expect(loadedTree.nodes.test).toHaveProperty('name', 'Test Node');
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
        const loadedTree = getOrganizationGroups(store$.state);
        expect(loadedTree).not.toBeUndefined();
        expect(loadedTree.rootIds).toBeEmpty();
        expect(loadedTree.edges).toBeEmpty();
        expect(loadedTree.nodes).toBeEmpty();
      });
    });
  });
});
