import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { PunchoutUser } from '../../models/punchout-user/punchout-user.model';
import { PunchoutStoreModule } from '../punchout-store.module';

import { loadPunchoutUsers, loadPunchoutUsersFail, loadPunchoutUsersSuccess } from './punchout-users.actions';
import {
  getPunchoutError,
  getPunchoutLoading,
  getPunchoutUsers,
  getSelectedPunchoutUser,
} from './punchout-users.selectors';

describe('Punchout Users Selectors', () => {
  let store$: StoreWithSnapshots;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['router']),
        PunchoutStoreModule.forTesting('punchoutUsers'),
        RouterTestingModule.withRoutes([{ path: 'account/punchout/:PunchoutLogin', children: [] }]),
      ],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
    router = TestBed.inject(Router);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getPunchoutLoading(store$.state)).toBeFalse();
    });

    it('should not have an error when in initial state', () => {
      expect(getPunchoutError(store$.state)).toBeUndefined();
    });

    it('should not have entities when in initial state', () => {
      expect(getPunchoutUsers('oci')(store$.state)).toBeEmpty();
    });
  });

  describe('loadPunchoutUsers', () => {
    const action = loadPunchoutUsers({ type: 'oci' });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getPunchoutLoading(store$.state)).toBeTrue();
    });

    describe('loadPunchoutUsersSuccess', () => {
      const users = [
        { id: '1', punchoutType: 'oci' },
        { id: '2', punchoutType: 'oci' },
      ] as PunchoutUser[];
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
        expect(getPunchoutUsers('oci')(store$.state)).not.toBeEmpty();
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
        expect(getPunchoutUsers('oci')(store$.state)).toBeEmpty();
      });
    });
  });

  describe('SelectedPunchoutUser', () => {
    beforeEach(() => {
      const users = [
        { id: '1', login: '1', punchoutType: 'oci' },
        { id: '2', login: '2', punchoutType: 'oci' },
      ] as PunchoutUser[];
      const successAction = loadPunchoutUsersSuccess({ users });
      store$.dispatch(successAction);
    });

    describe('with punchout user detail route', () => {
      beforeEach(fakeAsync(() => {
        router.navigate(['account/punchout', '1']);
        tick(500);
      }));

      it('should return the punchout user information when used', () => {
        expect(getPunchoutUsers('oci')(store$.state)).not.toBeEmpty();
        expect(getPunchoutLoading(store$.state)).toBeFalse();
      });

      it('should return the selected user when the punchout user login is given as query param', () => {
        expect(getSelectedPunchoutUser(store$.state)).toMatchInlineSnapshot(`
          Object {
            "id": "1",
            "login": "1",
            "punchoutType": "oci",
          }
        `);
      });
    });
  });
});
