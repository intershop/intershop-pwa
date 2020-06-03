import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { Category } from 'ish-core/models/category/category.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import {
  CategoriesAction,
  LoadCategory,
  LoadCategoryFail,
  LoadCategorySuccess,
  LoadTopLevelCategoriesSuccess,
} from './categories.actions';
import { categoriesReducer, initialState } from './categories.reducer';

describe('Categories Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as CategoriesAction;
      const state = categoriesReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('LoadCategory actions', () => {
    describe('LoadCategory action', () => {
      it('should set loading to true', () => {
        const action = new LoadCategory({ categoryId: '123' });
        const state = categoriesReducer(initialState, action);

        expect(state.loading).toBeTrue();
        expect(state.categories).toEqual(categoryTree());
      });
    });

    describe('LoadCategoryFail action', () => {
      it('should set loading to false', () => {
        const action = new LoadCategoryFail({ error: {} as HttpError });
        const state = categoriesReducer(initialState, action);

        expect(state.loading).toBeFalse();
        expect(state.categories).toEqual(categoryTree());
      });
    });

    describe('LoadCategorySuccess action', () => {
      let category: Category;

      beforeEach(() => {
        category = {
          name: 'Camcorders',
          description: 'The camera products and services catalog.',
          uniqueId: 'Camcorders.584',
          completenessLevel: 0,
        } as Category;
      });

      it('should insert category if not exists', () => {
        const action = new LoadCategorySuccess({ categories: categoryTree([category]) });
        const state = categoriesReducer(initialState, action);

        expect(Object.keys(state.categories.nodes)).toHaveLength(1);
        expect(state.categories.nodes[category.uniqueId]).toEqual(category);
      });

      it('should update category if already exists', () => {
        const action1 = new LoadCategorySuccess({ categories: categoryTree([category]) });
        const state1 = categoriesReducer(initialState, action1);

        const updatedCategory = {
          ...category,
          name: 'Updated',
          description: 'Updated category',
          completenessLevel: 2,
        };

        const action2 = new LoadCategorySuccess({ categories: categoryTree([updatedCategory]) });
        const state2 = categoriesReducer(state1, action2);

        expect(Object.keys(state2.categories.nodes)).toHaveLength(1);
        expect(state2.categories.nodes[category.uniqueId]).toEqual(updatedCategory);
      });

      it('should set loading to false', () => {
        const action = new LoadCategorySuccess({ categories: categoryTree([category]) });
        const state = categoriesReducer(initialState, action);

        expect(state.loading).toBeFalse();
      });
    });
  });

  describe('LoadTopLevelCategoriesSuccess action', () => {
    let categories: CategoryTree;

    beforeEach(() => {
      categories = categoryTree([
        { uniqueId: '1', categoryPath: ['1'] },
        {
          uniqueId: '1.1',
          categoryPath: ['1', '1.1'],
          name: 'updated',
        },
        {
          uniqueId: '1.1.1',
          categoryPath: ['1', '1.1', '1.1.1'],
        },
        { uniqueId: '2', categoryPath: ['2'] },
        {
          uniqueId: '2.1',
          categoryPath: ['2', '2.1'],
        },
        {
          uniqueId: '2.2',
          categoryPath: ['2', '2.2'],
        },
      ] as Category[]);
    });

    it('should add all flattened categories to the entities state', () => {
      const action = new LoadTopLevelCategoriesSuccess({ categories });
      const state = categoriesReducer(initialState, action);

      const expectedIds = ['1', '2', '1.1', '1.1.1', '2.1', '2.2'];

      expect(Object.keys(state.categories.nodes)).toHaveLength(6);
      expect(Object.keys(state.categories.nodes)).toEqual(expectedIds);
      expect(state.categories.nodes['1.1'].name).toEqual('updated');
    });

    it('should collect the IDs for all top level categories in the state', () => {
      const action = new LoadTopLevelCategoriesSuccess({ categories });
      const state = categoriesReducer(initialState, action);

      const topLevelIds = ['1', '2'];

      expect(state.categories.rootIds).toEqual(topLevelIds);
    });

    it('should remember if top level categories were loaded', () => {
      const action = new LoadTopLevelCategoriesSuccess({ categories });
      const state = categoriesReducer(initialState, action);

      expect(state.topLevelLoaded).toBeTrue();
    });
  });
});
