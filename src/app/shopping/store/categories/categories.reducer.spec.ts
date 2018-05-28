import { HttpErrorResponse } from '@angular/common/http';
import { CategoryTree } from '../../../models/category-tree/category-tree.model';
import { Category } from '../../../models/category/category.model';
import { categoryTree } from '../../../utils/dev/test-data-utils';
import * as fromActions from './categories.actions';
import { categoriesReducer, initialState } from './categories.reducer';

describe('Categories Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as fromActions.CategoriesAction;
      const state = categoriesReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('SelectCategory action', () => {
    it('should set the selected attribute in the state when SelectCategory is reduced', () => {
      const action = new fromActions.SelectCategory('dummy');
      const state = categoriesReducer(initialState, action);

      expect(state.selected).toEqual('dummy');
    });
  });

  describe('LoadCategory actions', () => {
    describe('LoadCategory action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.LoadCategory('123');
        const state = categoriesReducer(initialState, action);

        expect(state.loading).toEqual(true);
        expect(state.categories).toEqual(categoryTree());
      });
    });

    describe('LoadCategoryFail action', () => {
      it('should set loading to false', () => {
        const action = new fromActions.LoadCategoryFail({} as HttpErrorResponse);
        const state = categoriesReducer(initialState, action);

        expect(state.loading).toEqual(false);
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
        const action = new fromActions.LoadCategorySuccess(categoryTree([category]));
        const state = categoriesReducer(initialState, action);

        expect(Object.keys(state.categories.nodes).length).toBe(1);
        expect(state.categories.nodes[category.uniqueId]).toEqual(category);
      });

      it('should update category if already exists', () => {
        const action1 = new fromActions.LoadCategorySuccess(categoryTree([category]));
        const state1 = categoriesReducer(initialState, action1);

        const updatedCategory = {
          ...category,
          name: 'Updated',
          description: 'Updated category',
          completenessLevel: 2,
        } as Category;

        const action2 = new fromActions.LoadCategorySuccess(categoryTree([updatedCategory]));
        const state2 = categoriesReducer(state1, action2);

        expect(Object.keys(state2.categories.nodes).length).toBe(1);
        expect(state2.categories.nodes[category.uniqueId]).toEqual(updatedCategory);
      });

      it('should set loading to false', () => {
        const action = new fromActions.LoadCategorySuccess(categoryTree([category]));
        const state = categoriesReducer(initialState, action);

        expect(state.loading).toEqual(false);
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
      const action = new fromActions.LoadTopLevelCategoriesSuccess(categories);
      const state = categoriesReducer(initialState, action);

      const expectedIds = ['1', '2', '1.1', '1.1.1', '2.1', '2.2'];

      expect(Object.keys(state.categories.nodes).length).toBe(6);
      expect(Object.keys(state.categories.nodes)).toEqual(expectedIds);
      expect(state.categories.nodes['1.1'].name).toEqual('updated');
    });

    it('should collect the IDs for all top level categories in the state', () => {
      const action = new fromActions.LoadTopLevelCategoriesSuccess(categories);
      const state = categoriesReducer(initialState, action);

      const topLevelIds = ['1', '2'];

      expect(state.categories.rootIds).toEqual(topLevelIds);
    });
  });
});
