import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';
import { PunchoutStoreModule } from '../punchout-store.module';

import { loadPunchoutUsers, loadPunchoutUsersFail, loadPunchoutUsersSuccess } from './oci-punchout.actions';
import { getPunchoutError, getPunchoutLoading, getPunchoutUsers } from './oci-punchout.selectors';

describe('Oci Punchout Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CoreStoreModule.forTesting(), PunchoutStoreModule.forTesting('ociPunchout')],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getPunchoutLoading(store$.state)).toBeFalse();
    });

    it('should not have an error when in initial state', () => {
      expect(getPunchoutError(store$.state)).toBeUndefined();
    });

    it('should not have entities when in initial state', () => {
      expect(getPunchoutUsers(store$.state)).toBeEmpty();
    });
  });

  describe('loadPunchoutUsers', () => {
    const action = loadPunchoutUsers();

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getPunchoutLoading(store$.state)).toBeTrue();
    });

    describe('loadPunchoutUsersSuccess', () => {
      const users = [{ id: '1' }, { id: '2' }] as PunchoutUser[];
      const successAction = loadPunchoutUsersSuccess({ users });

      beforeEach(() => {
        store$.dispatch(successAction);
      });

      it('should set loading to false', () => {
        expect(getPunchoutLoading(store$.state)).toBeFalse();
      });

      it('should not have an error when successfully loaded entities', () => {
        expect(getPunchoutError(store$.state)).toBeUndefined();
      });

      it('should have entities when successfully loading', () => {
        expect(getPunchoutUsers(store$.state)).not.toBeEmpty();
      });
    });

    describe('loadPunchoutUsersFail', () => {
      const error = makeHttpError({ message: 'ERROR' });
      const failAction = loadPunchoutUsersFail({ error });

      beforeEach(() => {
        store$.dispatch(failAction);
      });

      it('should set loading to false', () => {
        expect(getPunchoutLoading(store$.state)).toBeFalse();
      });

      it('should have an error when reducing', () => {
        expect(getPunchoutError(store$.state)).toBeTruthy();
      });

      it('should not have entities when reducing error', () => {
        expect(getPunchoutUsers(store$.state)).toBeEmpty();
      });
    });
  });
});
