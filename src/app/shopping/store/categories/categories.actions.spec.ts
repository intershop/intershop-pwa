import { Category } from 'ish-core/models/category/category.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { categoryTree } from '../../../utils/dev/test-data-utils';

import * as fromActions from './categories.actions';

describe('Categories Actions', () => {
  describe('LoadTopLevelCategories Actions', () => {
    it('should create new action for LoadTopLevelCategories', () => {
      const payload = 3;
      const action = new fromActions.LoadTopLevelCategories(payload);

      expect({ ...action }).toEqual({
        type: fromActions.CategoriesActionTypes.LoadTopLevelCategories,
        payload,
      });
    });

    it('should create new action for LoadTopLevelCategoriesFail', () => {
      const payload = { message: 'error' } as HttpError;
      const action = new fromActions.LoadTopLevelCategoriesFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.CategoriesActionTypes.LoadTopLevelCategoriesFail,
        payload,
      });
    });

    it('should create new action for LoadTopLevelCategoriesSuccess', () => {
      const payload = categoryTree([{ uniqueId: '123' } as Category, { uniqueId: '456' } as Category]);
      const action = new fromActions.LoadTopLevelCategoriesSuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.CategoriesActionTypes.LoadTopLevelCategoriesSuccess,
        payload,
      });
    });
  });

  describe('LoadCategory Actions', () => {
    it('should create new action for LoadCategory', () => {
      const payload = '123';
      const action = new fromActions.LoadCategory(payload);

      expect({ ...action }).toEqual({
        type: fromActions.CategoriesActionTypes.LoadCategory,
        payload,
      });
    });

    it('should create new action for LoadCategoryFail', () => {
      const payload = { message: 'error' } as HttpError;
      const action = new fromActions.LoadCategoryFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.CategoriesActionTypes.LoadCategoryFail,
        payload,
      });
    });

    it('should create new action for LoadCategorySuccess', () => {
      const payload = categoryTree([{ uniqueId: '123' } as Category]);
      const action = new fromActions.LoadCategorySuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.CategoriesActionTypes.LoadCategorySuccess,
        payload,
      });
    });
  });
});
