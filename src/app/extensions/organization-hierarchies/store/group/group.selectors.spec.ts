import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { OrganizationGroup } from '../../models/organization-group/organization-group.model';
import { OrganizationHierarchiesStoreModule } from '../organization-hierarchies-store.module';

import { loadGroups, loadGroupsFail, loadGroupsSuccess } from './group.actions';
import { getGroupsOfOrganization, getGroupsOfOrganizationCount } from './group.selectors';

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
      store$.dispatch(loadGroupsSuccess({ groups }));
      expect(getGroupsOfOrganization(store$.state)).not.toBeEmpty();
      expect(getGroupsOfOrganizationCount(store$.state)).toBe(2);
    });

    it('should set loading to false and set error state', () => {
      store$.dispatch(loadGroupsFail({ error: makeHttpError({}) }));

      expect(getGroupsOfOrganization(store$.state)).toBeEmpty();
      expect(getGroupsOfOrganizationCount(store$.state)).toBe(0);
    });
  });
});
