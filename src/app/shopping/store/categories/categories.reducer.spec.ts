import { Category } from '../../../models/category/category.model';
import * as fromActions from './categories.actions';
import { categoriesReducer, initialState } from './categories.reducer';

describe('Categories Reducer', () => {
  describe('undefined action', () => {
    it('should return the default state when previous state is undefined', () => {
      const action = {} as any;
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
        const action = new fromActions.LoadCategoryFail({});
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
          type: 'Category',
          description: 'The camera products and services catalog.',
          id: '584',
          uniqueId: 'Camcorders.584'
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
          description: 'Updated category'
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
          { id: '789', name: 'Three', uniqueId: 'Foo.789' } as Category
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
});
