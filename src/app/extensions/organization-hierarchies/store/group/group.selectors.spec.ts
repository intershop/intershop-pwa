import { TestBed } from '@angular/core/testing';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
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

  describe('LoadGroup', () => {
    const action = loadGroup();

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getGroupLoading(store$.state)).toBeTrue();
    });

    describe('loadGroupSuccess', () => {
      const group = [{ id: '1' }, { id: '2' }] as OrganizationGroup[];
      const successAction = loadGroupSuccess({ group });

      beforeEach(() => {
        store$.dispatch(successAction);
      });

      it('should set loading to false', () => {
        expect(getGroupLoading(store$.state)).toBeFalse();
      });

      it('should not have an error when successfully loaded entities', () => {
        expect(getGroupError(store$.state)).toBeUndefined();
      });

      it('should have entities when successfully loading', () => {
        expect(getGroupEntities(store$.state)).not.toBeEmpty();
        expect(getGroup(store$.state)).not.toBeEmpty();
        expect(getNumberOfGroup(store$.state)).toBe(2);
      });
    });

    describe('loadGroupFail', () => {
      const error = { error: 'ERROR' } as HttpError;
      const failAction = loadGroupFail({ error });

      beforeEach(() => {
        store$.dispatch(failAction);
      });

      it('should set loading to false', () => {
        expect(getGroupLoading(store$.state)).toBeFalse();
      });

      it('should have an error when reducing', () => {
        expect(getGroupError(store$.state)).toBeTruthy();
      });

      it('should not have entities when reducing error', () => {
        expect(getGroupEntities(store$.state)).toBeEmpty();
        expect(getGroup(store$.state)).toBeEmpty();
        expect(getNumberOfGroup(store$.state)).toBe(0);
      });
    });
  });
});
