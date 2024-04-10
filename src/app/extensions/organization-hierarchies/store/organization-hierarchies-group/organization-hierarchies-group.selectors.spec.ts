import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { OrganizationHierarchiesGroup } from '../../models/organization-hierarchies-group/organization-hierarchies-group.model';
import { OrganizationHierarchiesStoreModule } from '../organization-hierarchies-store.module';

import { assignGroup, loadGroups, loadGroupsFail, loadGroupsSuccess } from './organization-hierarchies-group.actions';
import {
  getGroupDetails,
  getGroupsOfOrganization,
  getGroupsOfOrganizationCount,
  getRootGroupDetails,
  getSelectedGroupDetails,
} from './organization-hierarchies-group.selectors';

describe('Organization Hierarchies Group Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), OrganizationHierarchiesStoreModule.forTesting('group')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not have entities when in initial state', () => {
      expect(getGroupsOfOrganization(store$.state)).toBeEmpty();
      expect(getGroupsOfOrganizationCount(store$.state)).toBe(0);
    });
  });

  describe('loading groups', () => {
    const action = loadGroups();

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to false and set group state', () => {
      const groups = [
        { id: '1', displayName: 'Test 1' },
        { id: '2', displayName: 'Test 2' },
      ] as OrganizationHierarchiesGroup[];
      store$.dispatch(loadGroupsSuccess({ groups }));
      expect(getGroupsOfOrganization(store$.state)).not.toBeEmpty();
      expect(getGroupsOfOrganizationCount(store$.state)).toBe(2);
      expect(getGroupDetails('not-existing')(store$.state)).toBeUndefined();
      expect(getGroupDetails('1')(store$.state)).toMatchInlineSnapshot(`
        {
          "displayName": "Test 1",
          "id": "1",
        }
      `);
    });

    it('should set loading to false and set error state', () => {
      store$.dispatch(loadGroupsFail({ error: makeHttpError({}) }));

      expect(getGroupsOfOrganization(store$.state)).toBeEmpty();
      expect(getGroupsOfOrganizationCount(store$.state)).toBe(0);
    });
  });

  describe('selected group', () => {
    const groups = [
      { id: '1', displayName: 'Test 1' },
      { id: '2', displayName: 'Test 2', parentid: '1' },
    ] as OrganizationHierarchiesGroup[];

    beforeEach(() => {
      store$.dispatch(loadGroupsSuccess({ groups }));
    });

    it('should set selected to 1', () => {
      store$.dispatch(assignGroup({ id: '1' }));
      expect(getSelectedGroupDetails(store$.state)).toMatchInlineSnapshot(`
        {
          "displayName": "Test 1",
          "id": "1",
        }
      `);
    });

    it('should set selected to 2', () => {
      store$.dispatch(assignGroup({ id: '2' }));
      expect(getSelectedGroupDetails(store$.state)).toMatchInlineSnapshot(`
        {
          "displayName": "Test 2",
          "id": "2",
          "parentid": "1",
        }
      `);
    });

    it('should set selected to undefined', () => {
      store$.dispatch(assignGroup({ id: '3' }));
      expect(getSelectedGroupDetails(store$.state)).toBeFalsy();
    });
  });

  describe('get root group', () => {
    const action = loadGroups();

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should deliver first group without parent', () => {
      const groups = [
        { id: '1', displayName: 'Test 1' },
        { id: '2', displayName: 'Test 2' },
      ] as OrganizationHierarchiesGroup[];
      store$.dispatch(loadGroupsSuccess({ groups }));
      expect(getRootGroupDetails(store$.state)).toMatchInlineSnapshot(`
        {
          "displayName": "Test 1",
          "id": "1",
        }
      `);
    });

    it('should deliver group without parent', () => {
      const groups = [
        { id: '1', displayName: 'Test 1', parentId: 'Test2' },
        { id: '2', displayName: 'Test 2' },
      ] as OrganizationHierarchiesGroup[];
      store$.dispatch(loadGroupsSuccess({ groups }));
      expect(getRootGroupDetails(store$.state)).toMatchInlineSnapshot(`
        {
          "displayName": "Test 2",
          "id": "2",
        }
      `);
    });
  });
});
