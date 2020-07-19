import { CategoryTree } from 'ish-core/models/category-tree/category-tree.model';
import { Category } from 'ish-core/models/category/category.model';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import {
  loadCategory,
  loadCategoryFail,
  loadCategorySuccess,
  loadTopLevelCategories,
  loadTopLevelCategoriesFail,
  loadTopLevelCategoriesSuccess,
} from './categories.actions';
import { categoriesReducer, initialState } from './categories.reducer';

describe('Categories Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as ReturnType<
        | typeof loadTopLevelCategories
        | typeof loadTopLevelCategoriesFail
        | typeof loadTopLevelCategoriesSuccess
        | typeof loadCategory
        | typeof loadCategoryFail
        | typeof loadCategorySuccess
      >;
      const state = categoriesReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('LoadCategory actions', () => {
    describe('LoadCategory action', () => {
      it('should set loading to true', () => {
        const action = loadCategory({ categoryId: '123' });
        const state = categoriesReducer(initialState, action);

        expect(state.categories).toEqual(categoryTree());
      });
    });

    describe('LoadCategoryFail action', () => {
      it('should set loading to false', () => {
        const action = loadCategoryFail({ error: makeHttpError({}) });
        const state = categoriesReducer(initialState, action);

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
        const action = loadCategorySuccess({ categories: categoryTree([category]) });
        const state = categoriesReducer(initialState, action);

        expect(Object.keys(state.categories.nodes)).toHaveLength(1);
        expect(state.categories.nodes[category.uniqueId]).toEqual(category);
      });

      it('should update category if already exists', () => {
        const action1 = loadCategorySuccess({ categories: categoryTree([category]) });
        const state1 = categoriesReducer(initialState, action1);

        const updatedCategory = {
          ...category,
          name: 'Updated',
          description: 'Updated category',
          completenessLevel: 2,
        };

        const action2 = loadCategorySuccess({ categories: categoryTree([updatedCategory]) });
        const state2 = categoriesReducer(state1, action2);

        expect(Object.keys(state2.categories.nodes)).toHaveLength(1);
        expect(state2.categories.nodes[category.uniqueId]).toEqual(updatedCategory);
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
      const action = loadTopLevelCategoriesSuccess({ categories });
      const state = categoriesReducer(initialState, action);

      const expectedIds = ['1', '2', '1.1', '1.1.1', '2.1', '2.2'];

      expect(Object.keys(state.categories.nodes)).toHaveLength(6);
      expect(Object.keys(state.categories.nodes)).toEqual(expectedIds);
      expect(state.categories.nodes['1.1'].name).toEqual('updated');
    });

    it('should collect the IDs for all top level categories in the state', () => {
      const action = loadTopLevelCategoriesSuccess({ categories });
      const state = categoriesReducer(initialState, action);

      const topLevelIds = ['1', '2'];

      expect(state.categories.rootIds).toEqual(topLevelIds);
    });
  });
});
