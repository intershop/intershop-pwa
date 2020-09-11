import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { OrganizationGroup } from '../../models/organization-group/organization-group.model';
import { OrganizationHierarchiesStoreModule } from '../organization-hierarchies-store.module';

import { loadGroup, loadGroupFail, loadGroupSuccess } from './group.actions';
import { getGroup, getGroupEntities, getGroupError, getGroupLoading, getNumberOfGroup } from './group.selectors';

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
      expect(getGroup(store$.state)).toBeEmpty();
      expect(getNumberOfGroup(store$.state)).toBe(0);
    });
  });

  describe('loading groups', () => {
    const action = loadGroup();

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getGroupLoading(store$.state)).toBeTrue();
    });

    it('should set loading to false and set group state', () => {
      const group = [{ id: '1' }, { id: '2' }] as OrganizationGroup[];
      store$.dispatch(loadGroupSuccess({ group }));
      expect(getGroupLoading(store$.state)).toBeFalse();
      expect(getGroupError(store$.state)).toBeUndefined();
      expect(getGroupEntities(store$.state)).not.toBeEmpty();
      expect(getGroup(store$.state)).not.toBeEmpty();
      expect(getNumberOfGroup(store$.state)).toBe(2);
    });

    it('should set loading to false and set error state', () => {
      store$.dispatch(loadGroupFail({ error: makeHttpError({}) }));

      expect(getGroupLoading(store$.state)).toBeFalse();
      expect(getGroupError(store$.state)).toBeTruthy();
      expect(getGroupEntities(store$.state)).toBeEmpty();
      expect(getGroup(store$.state)).toBeEmpty();
      expect(getNumberOfGroup(store$.state)).toBe(0);
    });
  });
});
