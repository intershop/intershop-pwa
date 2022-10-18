import { TestBed } from '@angular/core/testing';
import { Action, combineReducers } from '@ngrx/store';
import { identity } from 'rxjs';

import { applyConfiguration, getICMBaseURL } from 'ish-core/store/core/configuration';
import { CoreState } from 'ish-core/store/core/core-store';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { loginUser, logoutUserSuccess } from 'ish-core/store/customer/user';

import { StoreWithSnapshots, provideStoreSnapshots } from './dev/ngrx-testing';
import { resetOnLogoutMeta, resetSubStatesOnActionsMeta } from './meta-reducers';

describe('Meta Reducers', () => {
  describe('resetSubStatesOnActionsMeta', () => {
    let store$: StoreWithSnapshots;
    const baseURL = 'http://url.de';

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [
          CoreStoreModule.forTesting(['configuration'], true, [
            resetSubStatesOnActionsMeta<CoreState>(['configuration'], [logoutUserSuccess]),
          ]),
        ],
        providers: [provideStoreSnapshots()],
      });

      store$ = TestBed.inject(StoreWithSnapshots);
    });

    describe('on logout action', () => {
      beforeEach(() => {
        store$.dispatch(applyConfiguration({ baseURL }));
      });

      it('should reset the configuration sub state', () => {
        expect(getICMBaseURL(store$.state)).toEqual(baseURL);

        store$.dispatch(logoutUserSuccess());

        expect(getICMBaseURL(store$.state)).toBeUndefined();
      });
    });

    describe('on another action', () => {
      beforeEach(() => {
        store$.dispatch(applyConfiguration({ baseURL }));
      });

      it('should not change the configuration sub state', () => {
        expect(getICMBaseURL(store$.state)).toEqual(baseURL);

        store$.dispatch(loginUser({ credentials: { login: 'user', password: 'password' } }));

        expect(getICMBaseURL(store$.state)).toEqual(baseURL);
      });
    });
  });

  describe('resetOnLogoutMeta', () => {
    const state = {
      a: 1,
      b: {
        c: 2,
      },
    };

    const reducer = combineReducers({
      a: (s = 'initialA') => s,
      b: (s = 'initialB') => s,
    });

    it('should reset state when reducing LogoutUser action', () => {
      const result = resetOnLogoutMeta(identity)(state, logoutUserSuccess());
      expect(result).toBeUndefined();
    });

    it('should reset and delegate to reducer initial state when reducing LogoutUser action', () => {
      const result = resetOnLogoutMeta(reducer)(state, logoutUserSuccess());
      expect(result).toEqual({ a: 'initialA', b: 'initialB' });
    });

    it('should not react on any other action with upstream reducer', () => {
      const result = resetOnLogoutMeta(reducer)(state, {} as Action);
      expect(result).toBe(state);
    });
  });
});
