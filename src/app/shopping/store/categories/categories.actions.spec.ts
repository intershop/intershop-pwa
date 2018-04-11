import { HttpErrorResponse } from '@angular/common/http';
import { Category } from '../../../models/category/category.model';
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
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.LoadTopLevelCategoriesFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.CategoriesActionTypes.LoadTopLevelCategoriesFail,
        payload,
      });
    });

    it('should create new action for LoadTopLevelCategoriesSuccess', () => {
      const payload = [{ uniqueId: '123' } as Category, { uniqueId: '456' } as Category];
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
      const payload = { message: 'error' } as HttpErrorResponse;
      const action = new fromActions.LoadCategoryFail(payload);

      expect({ ...action }).toEqual({
        type: fromActions.CategoriesActionTypes.LoadCategoryFail,
        payload,
      });
    });

    it('should create new action for LoadCategorySuccess', () => {
      const payload = { uniqueId: '123' } as Category;
      const action = new fromActions.LoadCategorySuccess(payload);

      expect({ ...action }).toEqual({
        type: fromActions.CategoriesActionTypes.LoadCategorySuccess,
        payload,
      });
    });
  });

  it('should create new action for SaveSubCategories', () => {
    const payload = [{ uniqueId: '123' }, { uniqueId: '456' }] as Category[];

    const action = new fromActions.SaveSubCategories(payload);

    expect({ ...action }).toEqual({
      type: fromActions.CategoriesActionTypes.SaveSubCategories,
      payload,
    });
  });

  it('should create new action for SetProductSkusForCategory', () => {
    const payload = ['123', '456'];
    const categoryUniqueId = '789';

    const action = new fromActions.SetProductSkusForCategory(categoryUniqueId, payload);

    expect({ ...action }).toEqual({
      type: fromActions.CategoriesActionTypes.SetProductSkusForCategory,
      payload,
      categoryUniqueId,
    });
  });
});
