import { HttpErrorResponse } from '@angular/common/http';
import { CategoryData } from '../../../models/category/category.interface';
import { CategoryMapper } from '../../../models/category/category.mapper';
import { Category } from '../../../models/category/category.model';
import * as fromActions from './categories.actions';
import { categoriesReducer, flattenSubCategories, initialState } from './categories.reducer';

describe('Categories Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as fromActions.CategoriesAction;
      const state = categoriesReducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('LoadCategory actions', () => {
    describe('LoadCategory action', () => {
      it('should set loading to true', () => {
        const action = new fromActions.LoadCategory('123');
        const state = categoriesReducer(initialState, action);

        expect(state.loading).toEqual(true);
        expect(state.entities).toEqual({});
      });
    });

    describe('LoadCategoryFail action', () => {
      it('should set loading to false', () => {
        const action = new fromActions.LoadCategoryFail({} as HttpErrorResponse);
        const state = categoriesReducer(initialState, action);

        expect(state.loading).toEqual(false);
        expect(state.entities).toEqual({});
      });
    });

    describe('LoadCategorySuccess action', () => {
      let category: Category;

      beforeEach(() => {
        category = {
          name: 'Camcorders',
          description: 'The camera products and services catalog.',
          id: '584',
          uniqueId: 'Camcorders.584',
        } as Category;
      });

      it('should insert category if not exists', () => {
        const action = new fromActions.LoadCategorySuccess(category);
        const state = categoriesReducer(initialState, action);

        expect(state.ids.length).toBe(1);
        expect(state.entities[category.uniqueId]).toEqual(category);
      });

      it('should update category if already exists', () => {
        const action1 = new fromActions.LoadCategorySuccess(category);
        const state1 = categoriesReducer(initialState, action1);

        const updatedCategory = {
          ...category,
          name: 'Updated',
          description: 'Updated category',
        } as Category;

        const action2 = new fromActions.LoadCategorySuccess(updatedCategory);
        const state2 = categoriesReducer(state1, action2);

        expect(state2.ids.length).toBe(1);
        expect(state2.entities[category.uniqueId]).toEqual(updatedCategory);
      });

      it('should set loading to false', () => {
        const action = new fromActions.LoadCategorySuccess(category);
        const state = categoriesReducer(initialState, action);

        expect(state.loading).toEqual(false);
      });
    });

    describe('SaveSubCategories action', () => {
      let categories: Category[];

      beforeEach(() => {
        categories = [
          { id: '123', name: 'One', uniqueId: 'Foo.123' } as Category,
          { id: '456', name: 'Two', uniqueId: 'Foo.456' } as Category,
          { id: '789', name: 'Three', uniqueId: 'Foo.789' } as Category,
        ];
      });

      it('should add a bunch of categories to the state', () => {
        const action = new fromActions.SaveSubCategories(categories);
        const state = categoriesReducer(initialState, action);

        expect(state.ids.length).toBe(3);
        expect(state.entities['Foo.123']).toBe(categories[0]);
        expect(state.entities['Foo.456']).toBe(categories[1]);
        expect(state.entities['Foo.789']).toBe(categories[2]);
      });
    });
  });

  describe('flattenSubCategories helper function', () => {
    let category: Category;

    beforeEach(() => {
      category = CategoryMapper.fromData({
        id: '1',
        hasOnlineSubCategories: true,
        subCategoriesCount: 3,
        subCategories: [
          { id: '2', hasOnlineSubCategories: false } as CategoryData,
          { id: '3', hasOnlineSubCategories: false } as CategoryData,
          {
            id: '4',
            hasOnlineSubCategories: true,
            subCategoriesCount: 2,
            subCategories: [
              {
                id: '5',
                hasOnlineSubCategories: true,
                subCategoriesCount: 2,
                subCategories: [{ id: '6' } as CategoryData, { id: '7' } as CategoryData],
              } as CategoryData,
              { id: '8' } as CategoryData,
            ],
          } as CategoryData,
        ],
      } as CategoryData);
    });

    it('should flatten nested subcategories for one top level category', () => {
      const flat = flattenSubCategories(category);
      const ids = flat.map(c => c.id);
      const expectedIds = ['2', '3', '6', '7', '5', '8', '4', '1'];

      expect(ids).toEqual(expectedIds);
    });

    it('should add all subCategoriesIds (uniqueIds) to each category', () => {
      const flat = flattenSubCategories(category);
      const subCategoriesIdsAll = flat.map(c => c.subCategoriesIds);
      const expected = [
        undefined,
        undefined,
        undefined,
        undefined,
        ['1.4.5.6', '1.4.5.7'],
        undefined,
        ['1.4.5', '1.4.8'],
        ['1.2', '1.3', '1.4'],
      ];

      expect(subCategoriesIdsAll).toEqual(expected);
    });

    it('should return the category unchanged in an array if it doesnt have subcategories', () => {
      category = CategoryMapper.fromData({
        id: 'foo',
        hasOnlineSubCategories: false,
        subCategoriesCount: 0,
      } as CategoryData);

      const result = flattenSubCategories(category);
      expect(result).toEqual([category]);
    });
  });

  describe('LoadTopLevelCategoriesSuccess action', () => {
    let categories: Category[];

    beforeEach(() => {
      categories = [
        {
          id: '1',
          uniqueId: '1',
          hasOnlineSubCategories: true,
          subCategoriesCount: 3,
          subCategories: [
            { id: '2', uniqueId: '1.2', hasOnlineSubCategories: false, name: 'updated' } as Category,
            { id: '3', uniqueId: '1.3', hasOnlineSubCategories: false } as Category,
            {
              id: '4',
              uniqueId: '1.4',
              hasOnlineSubCategories: true,
              subCategoriesCount: 2,
              subCategories: [
                {
                  id: '5',
                  uniqueId: '1.4.5',
                  hasOnlineSubCategories: true,
                  subCategoriesCount: 2,
                  subCategories: [
                    { id: '6', uniqueId: '1.4.5.6' } as Category,
                    { id: '7', uniqueId: '1.4.5.7' } as Category,
                  ],
                } as Category,
                { id: '8', uniqueId: '1.4.8', hasOnlineSubCategories: false } as Category,
              ],
            } as Category,
          ],
        } as Category,
        {
          id: '9',
          uniqueId: '9',
          hasOnlineSubCategories: true,
          subCategoriesCount: 3,
          subCategories: [
            { id: '10', uniqueId: '9.10', hasOnlineSubCategories: false } as Category,
            { id: '11', uniqueId: '9.11', hasOnlineSubCategories: false } as Category,
            {
              id: '12',
              uniqueId: '9.12',
              hasOnlineSubCategories: true,
              subCategoriesCount: 2,
              subCategories: [
                { id: '13', uniqueId: '9.12.13', hasOnlineSubCategories: false } as Category,
                { id: '14', uniqueId: '9.12.14', hasOnlineSubCategories: false } as Category,
              ],
            } as Category,
          ],
        } as Category,
      ];
    });

    it('should add all flattened categories to the entities state', () => {
      const action = new fromActions.LoadTopLevelCategoriesSuccess(categories);
      const state = categoriesReducer(initialState, action);

      const expectedIds = [
        '1.2',
        '1.3',
        '1.4.5.6',
        '1.4.5.7',
        '1.4.5',
        '1.4.8',
        '1.4',
        '1',
        '9.10',
        '9.11',
        '9.12.13',
        '9.12.14',
        '9.12',
        '9',
      ];

      expect(state.ids.length).toBe(14);
      expect(state.ids).toEqual(expectedIds);
      expect(state.entities['1.2'].name).toEqual(categories[0].subCategories[0].name);
    });

    it('should collect the IDs for all top level categories in the state', () => {
      const action = new fromActions.LoadTopLevelCategoriesSuccess(categories);
      const state = categoriesReducer(initialState, action);

      const topLevelIds = ['1', '9'];

      expect(state.topLevelCategoriesIds).toEqual(topLevelIds);
    });

    it('should update entities when they already exist', () => {
      const action = new fromActions.LoadTopLevelCategoriesSuccess(categories);
      const newInitialState = {
        ...initialState,
        entities: {
          '1.2': { id: '2', uniqueId: '1.2', name: 'mycategory', description: 'thedescription' } as Category,
        },
      };
      const state = categoriesReducer(newInitialState, action);

      expect(state.entities['1.2'].name).toEqual('updated');
      expect(state.entities['1.2'].description).toEqual('thedescription');
    });
  });
});
