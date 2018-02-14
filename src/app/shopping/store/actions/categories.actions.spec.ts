import { Category } from '../../../models/category/category.model';
import * as fromActions from './categories.actions';
import { CategoriesActionTypes } from './categories.actions';

describe('Categories Actions', () => {
  describe('LoadCategory Actions', () => {
    it('LoadCategory should create a new action', () => {
      const payload = '123';
      const action = new fromActions.LoadCategory(payload);

      expect({ ...action }).toEqual({
        type: CategoriesActionTypes.LOAD_CATEGORY,
        payload
      });
    });

    it('LoadCategoryFail should create a new action', () => {
      const payload = { a: 'a' };
      const action = new fromActions.LoadCategoryFail(payload);

      expect({ ...action }).toEqual({
        type: CategoriesActionTypes.LOAD_CATEGORY_FAIL,
        payload
      });
    });

    it('LoadCategorySuccess should create a new action', () => {
      const payload = { uniqueId: '123' } as Category;
      const action = new fromActions.LoadCategorySuccess(payload);

      expect({ ...action }).toEqual({
        type: CategoriesActionTypes.LOAD_CATEGORY_SUCCESS,
        payload
      });
    });
  });

  it('SaveSubCategories should create a new action', () => {
    const payload = [
      { uniqueId: '123' },
      { uniqueId: '456' }
     ] as Category[];

    const action = new fromActions.SaveSubCategories(payload);

    expect({ ...action }).toEqual({
      type: CategoriesActionTypes.SAVE_SUBCATEGORIES,
      payload
    });
  });

  it('SetProductSkusForCategory should create a new action', () => {
    const payload = ['123', '456'];
    const categoryUniqueId = '789';

    const action = new fromActions.SetProductSkusForCategory(
      categoryUniqueId, payload
    );

    expect({ ...action }).toEqual({
      type: CategoriesActionTypes.SET_PRODUCT_SKUS_FOR_CATEGORY,
      payload,
      categoryUniqueId
    });
  });

});
