import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { OrganizationGroup } from '../../models/organization-group/organization-group.model';
import { OrganizationHierarchiesStoreModule } from '../organization-hierarchies-store.module';

import { assignGroup, loadGroups, loadGroupsFail, loadGroupsSuccess } from './group.actions';
import {
  getGroupDetails,
  getGroupsOfOrganization,
  getGroupsOfOrganizationCount,
  getSelectedGroupDetails,
} from './group.selectors';

describe('Group Selectors', () => {
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
        { id: '1', name: 'Test 1' },
        { id: '2', name: 'Test 2' },
      ] as OrganizationGroup[];
      store$.dispatch(loadGroupsSuccess({ groups, selectedGroupId: undefined }));
      expect(getGroupsOfOrganization(store$.state)).not.toBeEmpty();
      expect(getGroupsOfOrganizationCount(store$.state)).toBe(2);
      expect(getGroupDetails('not-existing')(store$.state)).toBeUndefined();
      expect(getGroupDetails('1')(store$.state)).toMatchInlineSnapshot(`
        Object {
          "id": "1",
          "name": "Test 1",
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
      { id: '1', name: 'Test 1' },
      { id: '2', name: 'Test 2', parentid: '1' },
    ] as OrganizationGroup[];

    beforeEach(() => {
      store$.dispatch(loadGroupsSuccess({ groups, selectedGroupId: undefined }));
    });

    it('should set selected to 1', () => {
      store$.dispatch(assignGroup({ id: '1' }));
      expect(getSelectedGroupDetails(store$.state)).toMatchInlineSnapshot(`
        Object {
          "id": "1",
          "name": "Test 1",
        }
      `);
    });

    it('should set selected to 2', () => {
      store$.dispatch(assignGroup({ id: '2' }));
      expect(getSelectedGroupDetails(store$.state)).toMatchInlineSnapshot(`
        Object {
          "id": "2",
          "name": "Test 2",
          "parentid": "1",
        }
      `);
    });

    it('should set selected to undefined', () => {
      store$.dispatch(assignGroup({ id: '3' }));
      expect(getSelectedGroupDetails(store$.state)).toBeFalsy();
    });
  });
});
