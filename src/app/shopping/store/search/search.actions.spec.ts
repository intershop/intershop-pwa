import { HttpError } from '../../../models/http-error/http-error.model';
import { SearchActionTypes, SearchProducts, SearchProductsFail, SearchProductsSuccess } from './search.actions';

describe('Search Actions', () => {
  describe('SearchProducts Action', () => {
    it('should create new action for SearchProducts', () => {
      const payload = 'aaa';
      const action = new SearchProducts(payload);

      expect({ ...action }).toEqual({
        type: SearchActionTypes.SearchProducts,
        payload,
      });
    });

    it('should create new action for SearchProductsSuccess', () => {
      const payload = 'search';
      const action = new SearchProductsSuccess(payload);

      expect({ ...action }).toEqual({
        type: SearchActionTypes.SearchProductsSuccess,
        payload,
      });
    });

    it('should create new action for SearchProductsFail', () => {
      const payload = { message: 'error' } as HttpError;
      const action = new SearchProductsFail(payload);

      expect({ ...action }).toEqual({
        type: SearchActionTypes.SearchProductsFail,
        payload,
      });
    });
  });
});
