import { TestBed } from '@angular/core/testing';
import { Actions } from '@ngrx/effects';
import { routerReducer } from '@ngrx/router-store';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { instance, mock, verify, when } from 'ts-mockito';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { navigateMockAction } from '../../../dev-utils/navigate-mock.action';
import { TestActions, testActionsFactory } from '../../../dev-utils/test.actions';
import { Category } from '../../../models/category/category.model';
import { ProductsService } from '../../services/products/products.service';
import { ShoppingState } from '../shopping.state';
import { reducers } from '../shopping.system';
import * as fromActions from './categories.actions';
import { CategoriesEffects } from './categories.effects';

describe('Categories Effects', () => {
  let actions$: TestActions;
  let effects: CategoriesEffects;
  let store: Store<ShoppingState>;

  let categoriesServiceMock: CategoriesService;
  let productsServiceMock: ProductsService;

  beforeEach(() => {
    categoriesServiceMock = mock(CategoriesService);
    productsServiceMock = mock(ProductsService);
    when(categoriesServiceMock.getCategory('123')).thenReturn(of({ uniqueId: '123' } as Category));
    when(categoriesServiceMock.getCategory('invalid')).thenReturn(_throw(''));

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(reducers),
          routerReducer: routerReducer
        }),
      ],
      providers: [
        CategoriesEffects,
        { provide: Actions, useFactory: testActionsFactory },
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
        { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
      ],
    });

    actions$ = TestBed.get(Actions);
    effects = TestBed.get(CategoriesEffects);
    store = TestBed.get(Store);
  });

  describe('selectedCategory$', () => {
    let category: Category;
    let setSelectedCategoryId;

    beforeEach(() => {
      category = {
        uniqueId: '123',
        id: '123',
        hasOnlineSubCategories: false
      } as Category;

      setSelectedCategoryId = function(id: string) {
        const routerAction = navigateMockAction({
          url: `/category/${id}`,
          params: { categoryUniqueId: id }
        });
        store.dispatch(routerAction);
      };
    });


    it('should do nothing for undefined category id', () => {
      expect(effects.selectedCategory$).toBeObservable(cold('-'));
    });

    it('should do nothing if category exists', () => {
      setSelectedCategoryId(category.uniqueId);
      store.dispatch(new fromActions.LoadCategorySuccess(category));
      expect(effects.selectedCategory$).toBeObservable(cold('-'));
    });

    it('should trigger LoadCategory if not exists', () => {
      setSelectedCategoryId(category.uniqueId);
      const completion = new fromActions.LoadCategory(category.uniqueId);
      const expected = cold('a', { a: completion });
      expect(effects.selectedCategory$).toBeObservable(expected);
    });

    it('should trigger LoadCategory if category exists but subcategories have not been loaded', () => {
      category.hasOnlineSubCategories = true;
      category.subCategories = undefined;
      store.dispatch(new fromActions.LoadCategorySuccess(category));
      setSelectedCategoryId(category.uniqueId);

      const completion = new fromActions.LoadCategory(category.uniqueId);
      const expected = cold('a', { a: completion });
      expect(effects.selectedCategory$).toBeObservable(expected);
    });

  });


  describe('loadCategory$', () => {
    it('should call the categoriesService for LoadCategory action', () => {
      const categoryId = '123';
      const action = new fromActions.LoadCategory(categoryId);
      actions$.stream = hot('-a', { a: action });

      effects.loadCategory$.subscribe(() => {
        verify(categoriesServiceMock.getCategory(categoryId)).once();
      });
    });

    it('should map to action of type LoadCategorySuccess', () => {
      const categoryId = '123';
      const action = new fromActions.LoadCategory(categoryId);
      const completion = new fromActions.LoadCategorySuccess({ uniqueId: categoryId } as Category);
      actions$.stream = hot('-a-a-a', { a: action });
      const expected = cold('-c-c-c', { c: completion });

      expect(effects.loadCategory$).toBeObservable(expected);
    });

    it('should map invalid request to action of type LoadCategoryFail', () => {
      const categoryId = 'invalid';
      const action = new fromActions.LoadCategory(categoryId);
      const completion = new fromActions.LoadCategoryFail('');
      actions$.stream = hot('-a-a-a', { a: action });
      const expected = cold('-c-c-c', { c: completion });

      expect(effects.loadCategory$).toBeObservable(expected);
    });
  });

  xdescribe('loadProductsForCategory$', () => {
    it('should do nothing when product is selected', () => {
      expect(false).toBe(true);
    });

    describe('when product is not selected', () => {
      it('should do nothing when category doesnt have online products', () => {
        expect(false).toBe(true);
      });

      it('should do nothing when category already has an SKU list', () => {
        expect(false).toBe(true);
      });

      it('should do nothing when no category is selected', () => {
        expect(false).toBe(true);
      });

      it('should call service for SKU list', () => {
        expect(false).toBe(true);
      });

      it('should trigger actions of type SetProductSkusForCategory and LoadProduct for each product in the list', () => {
        expect(false).toBe(true);
      });
    });
  });

  xdescribe('saveSubCategories$', () => {
    it('should map to action of type SaveSubCategories if subcategories exist', () => {
      expect(false).toBe(true);
    });

    it('should do nothing if no subcategories exist', () => {
      expect(false).toBe(true);
    });
  });
});
