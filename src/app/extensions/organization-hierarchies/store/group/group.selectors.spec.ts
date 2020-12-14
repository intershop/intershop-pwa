import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { OrganizationGroup } from '../../models/organization-group/organization-group.model';
import { OrganizationHierarchiesStoreModule } from '../organization-hierarchies-store.module';

import { loadGroups, loadGroupsFail, loadGroupsSuccess } from './group.actions';
import { getGroupEntities, getGroupError, getGroupLoading, getGroups, getNumberOfGroups } from './group.selectors';

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
    it('should not be loading when in initial state', () => {
      expect(getGroupLoading(store$.state)).toBeFalse();
    });

    it('should not have an error when in initial state', () => {
      expect(getGroupError(store$.state)).toBeUndefined();
    });

    it('should not have entities when in initial state', () => {
      expect(getGroupEntities(store$.state)).toBeEmpty();
      expect(getGroups(store$.state)).toBeEmpty();
      expect(getNumberOfGroups(store$.state)).toBe(0);
    });
  });

  describe('loading groups', () => {
    const action = loadGroups();

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getGroupLoading(store$.state)).toBeTrue();
    });

    it('should set loading to false and set group state', () => {
      const groups = [{ id: '1' }, { id: '2' }] as OrganizationGroup[];
      store$.dispatch(loadGroupsSuccess({ groups }));
      expect(getGroupLoading(store$.state)).toBeFalse();
      expect(getGroupError(store$.state)).toBeUndefined();
      expect(getGroupEntities(store$.state)).not.toBeEmpty();
      expect(getGroups(store$.state)).not.toBeEmpty();
      expect(getNumberOfGroups(store$.state)).toBe(2);
    });

    it('should set loading to false and set error state', () => {
      store$.dispatch(loadGroupsFail({ error: makeHttpError({}) }));

      expect(getGroupLoading(store$.state)).toBeFalse();
      expect(getGroupError(store$.state)).toBeTruthy();
      expect(getGroupEntities(store$.state)).toBeEmpty();
      expect(getGroups(store$.state)).toBeEmpty();
      expect(getNumberOfGroups(store$.state)).toBe(0);
    });
  });
});
