import { Action, combineReducers } from '@ngrx/store';
import { identity } from 'rxjs';

import { LogoutUser } from 'ish-core/store/account/user';

import { resetOnLogoutMeta } from './meta-reducers';

describe('Meta Reducers', () => {
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
      const result = resetOnLogoutMeta(identity)(state, new LogoutUser());
      expect(result).toBeEmpty();
    });

    it('should reset and delegate to reducer initial state when reducing LogoutUser action', () => {
      const result = resetOnLogoutMeta(reducer)(state, new LogoutUser());
      expect(result).toEqual({ a: 'initialA', b: 'initialB' });
    });

    it('should not react on any other action with upstream reducer', () => {
      const result = resetOnLogoutMeta(reducer)(state, {} as Action);
      expect(result).toBe(state);
    });
  });
});
