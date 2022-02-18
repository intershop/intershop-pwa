import { Action, ActionReducerMap, combineReducers } from '@ngrx/store';
import { identity } from 'rxjs';

import { CustomerUserType } from 'ish-core/models/customer/customer.model';
import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { loginUserSuccess, logoutUser } from 'ish-core/store/customer/user';
import { PromotionsState, promotionsReducer } from 'ish-core/store/shopping/promotions/promotions.reducer';
import { ShoppingState } from 'ish-core/store/shopping/shopping-store';

import { resetOnLogoutMeta, resetPersonalizedShoppingMeta } from './meta-reducers';

describe('Meta Reducers', () => {
  describe('resetPersonalizedShoppingMeta', () => {
    const state = {
      promotions: { ids: ['id'], entities: { id: { id: '123' } as Promotion } } as PromotionsState,
      productListing: { loading: false, itemsPerPage: 9, viewType: undefined, currentSettings: undefined },
    } as ShoppingState;

    const reducer = combineReducers({ promotions: promotionsReducer } as ActionReducerMap<ShoppingState>);

    it('should reset state when reducing LogoutUser action', () => {
      const result = resetPersonalizedShoppingMeta(identity)(state, logoutUser());
      expect(result.promotions).toBeUndefined();
      expect(result.productListing.itemsPerPage).toBe(9);
    });

    it('should reset state when reducing LoginUserSuccess action', () => {
      const result = resetPersonalizedShoppingMeta(identity)(
        state,
        loginUserSuccess({ customer: { customerNo: 'user' } } as CustomerUserType)
      );
      expect(result.promotions).toBeUndefined();
      expect(result.productListing.itemsPerPage).toBe(9);
    });

    it('should reset and delegate to reducer initial state when reducing LogoutUser action', () => {
      const result = resetPersonalizedShoppingMeta(reducer)(state, logoutUser());
      expect(result).toMatchInlineSnapshot(`
        Object {
          "promotions": Object {
            "entities": Object {},
            "ids": Array [],
          },
        }
      `);
    });

    it('should reset and delegate to reducer initial state when reducing LoginUserSuccess action', () => {
      const result = resetPersonalizedShoppingMeta(reducer)(
        state,
        loginUserSuccess({ customer: { customerNo: 'user' } } as CustomerUserType)
      );

      expect(result).toMatchInlineSnapshot(`
        Object {
          "promotions": Object {
            "entities": Object {},
            "ids": Array [],
          },
        }
      `);
    });

    it('should not react on any other action with upstream reducer', () => {
      const result = resetPersonalizedShoppingMeta(reducer)(state, {} as Action);
      expect(result).toBe(state);
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
      const result = resetOnLogoutMeta(identity)(state, logoutUser());
      expect(result).toBeUndefined();
    });

    it('should reset and delegate to reducer initial state when reducing LogoutUser action', () => {
      const result = resetOnLogoutMeta(reducer)(state, logoutUser());
      expect(result).toEqual({ a: 'initialA', b: 'initialB' });
    });

    it('should not react on any other action with upstream reducer', () => {
      const result = resetOnLogoutMeta(reducer)(state, {} as Action);
      expect(result).toBe(state);
    });
  });
});
