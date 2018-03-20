import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { routerReducer } from '@ngrx/router-store';
import { Action, combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold, getTestScheduler, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { Scheduler } from 'rxjs/Scheduler';
import { instance, mock, verify, when } from 'ts-mockito';
import { AVAILABLE_LOCALES, MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH } from '../../../core/configurations/injection-keys';
import { CategoriesService } from '../../../core/services/categories/categories.service';
import { SelectLocale, SetAvailableLocales } from '../../../core/store/locale';
import { localeReducer } from '../../../core/store/locale/locale.reducer';
import { Category } from '../../../models/category/category.model';
import { Locale } from '../../../models/locale/locale.model';
import { navigateMockAction } from '../../../utils/dev/navigate-mock.action';
import * as productsActions from '../products/products.actions';
import { ShoppingState } from '../shopping.state';
import { shoppingReducers } from '../shopping.system';
import * as fromActions from './categories.actions';
import { CategoriesEffects } from './categories.effects';

describe('Categories Effects', () => {
  let actions$: Observable<Action>;
  let effects: CategoriesEffects;
  let store$: Store<ShoppingState>;

  let categoriesServiceMock: CategoriesService;

  beforeEach(() => {
    categoriesServiceMock = mock(CategoriesService);
    when(categoriesServiceMock.getCategory('123')).thenReturn(of({ uniqueId: '123' } as Category));
    when(categoriesServiceMock.getCategory('invalid')).thenReturn(_throw(''));
    when(categoriesServiceMock.getTopLevelCategories(2)).thenReturn(of([
      { uniqueId: '123' } as Category,
      { uniqueId: '456' } as Category
    ]));
    when(categoriesServiceMock.getTopLevelCategories(-1)).thenReturn(_throw(''));

    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
          locale: localeReducer,
          routerReducer
        }),
      ],
      providers: [
        CategoriesEffects,
        provideMockActions(() => actions$),
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
        { provide: Scheduler, useFactory: getTestScheduler },
      ],
    });

    effects = TestBed.get(CategoriesEffects);
    store$ = TestBed.get(Store);
  });

  describe('selectedCategory$', () => {

    const setSelectedCategoryId = function(id: string) {
      const routerAction = navigateMockAction({
        url: `/category/${id}`,
        params: { categoryUniqueId: id }
      });
      store$.dispatch(routerAction);
    };

    it('should do nothing for undefined category id', () => {
      expect(effects.selectedCategory$).toBeObservable(cold('-'));
    });

    describe('for root categories', () => {

      let category: Category;

      beforeEach(() => {
        category = {
          uniqueId: '123',
          id: '123',
          hasOnlineSubCategories: false
        } as Category;
      });

      it('should do nothing if category exists', () => {
        setSelectedCategoryId(category.uniqueId);
        store$.dispatch(new fromActions.LoadCategorySuccess(category));
        expect(effects.selectedCategory$).toBeObservable(cold('-'));
      });

      it('should trigger LoadCategory if not exists', () => {
        setSelectedCategoryId(category.uniqueId);
        const completion = new fromActions.LoadCategory(category.uniqueId);
        const expected$ = cold('a', { a: completion });
        expect(effects.selectedCategory$).toBeObservable(expected$);
      });

      it('should trigger LoadCategory if category exists but subcategories have not been loaded', () => {
        category.hasOnlineSubCategories = true;
        category.subCategories = undefined;
        store$.dispatch(new fromActions.LoadCategorySuccess(category));
        setSelectedCategoryId(category.uniqueId);

        const completion = new fromActions.LoadCategory(category.uniqueId);
        const expected$ = cold('a', { a: completion });
        expect(effects.selectedCategory$).toBeObservable(expected$);
      });
    });

    describe('for leaf categories', () => {

      let category: Category;

      beforeEach(() => {
        category = {
          uniqueId: '123.456.789',
          id: '789',
          hasOnlineSubCategories: false
        } as Category;
      });

      it('should trigger multiple LoadCategory if they dont exist', () => {
        setSelectedCategoryId(category.uniqueId);

        const completionA = new fromActions.LoadCategory('123.456.789');
        const completionB = new fromActions.LoadCategory('123.456');
        const completionC = new fromActions.LoadCategory('123');
        const expected$ = cold('(abc)', { a: completionA, b: completionB, c: completionC });
        expect(effects.selectedCategory$).toBeObservable(expected$);
      });

      it('should not trigger LoadCategory for categories that exist', () => {
        store$.dispatch(new fromActions.LoadCategorySuccess(category));
        setSelectedCategoryId(category.uniqueId);

        const completionB = new fromActions.LoadCategory('123.456');
        const completionC = new fromActions.LoadCategory('123');
        const expected$ = cold('(bc)', { b: completionB, c: completionC });
        expect(effects.selectedCategory$).toBeObservable(expected$);
      });
    });
  });

  describe('loadCategory$', () => {
    it('should call the categoriesService for LoadCategory action', () => {
      const categoryId = '123';
      const action = new fromActions.LoadCategory(categoryId);
      actions$ = hot('-a', { a: action });

      effects.loadCategory$.subscribe(() => {
        verify(categoriesServiceMock.getCategory(categoryId)).once();
      });
    });

    it('should map to action of type LoadCategorySuccess', () => {
      const categoryId = '123';
      const action = new fromActions.LoadCategory(categoryId);
      const completion = new fromActions.LoadCategorySuccess({ uniqueId: categoryId } as Category);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadCategory$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadCategoryFail', () => {
      const categoryId = 'invalid';
      const action = new fromActions.LoadCategory(categoryId);
      const completion = new fromActions.LoadCategoryFail('');
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadCategory$).toBeObservable(expected$);
    });
  });

  describe('loadTopLevelCategoriesOnLanguageChange$', () => {

    let EN_US: Locale;
    let depth: number;

    beforeEach(() => {
      depth = TestBed.get(MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH);
      const locales: Locale[] = TestBed.get(AVAILABLE_LOCALES);
      EN_US = locales.find(v => v.lang.startsWith('en'));
      store$.dispatch(new SetAvailableLocales(locales));
    });

    it('should trigger when language is changed', () => {
      const action = new SelectLocale(EN_US);
      const completion = new fromActions.LoadTopLevelCategories(depth);
      store$.dispatch(action);
      const expected$ = cold('----------c', { c: completion });

      expect(effects.loadTopLevelCategoriesOnLanguageChange$).toBeObservable(expected$);
    });
  });

  describe('loadTopLevelCategories$', () => {
    it('should call the categoriesService for LoadTopLevelCategories action', () => {
      const limit = 2;
      const action = new fromActions.LoadTopLevelCategories(limit);
      actions$ = hot('-a', { a: action });

      effects.loadTopLevelCategories$.subscribe(() => {
        verify(categoriesServiceMock.getTopLevelCategories(limit)).once();
      });
    });

    it('should map to action of type LoadCategorySuccess', () => {
      const limit = 2;
      const action = new fromActions.LoadTopLevelCategories(limit);
      const completion = new fromActions.LoadTopLevelCategoriesSuccess([
        { uniqueId: '123' } as Category,
        { uniqueId: '456' } as Category
      ]);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadTopLevelCategories$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadCategoryFail', () => {
      const limit = -1;
      const action = new fromActions.LoadTopLevelCategories(limit);
      const completion = new fromActions.LoadTopLevelCategoriesFail('');
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadTopLevelCategories$).toBeObservable(expected$);
    });
  });

  describe('productOrCategoryChanged$', () => {
    let category: Category;
    let selectProduct;
    let selectCategory;

    beforeEach(() => {
      category = {
        uniqueId: '123',
        id: '123',
        hasOnlineProducts: false
      } as Category;

      selectCategory = function(cid: string) {
        const routerAction = navigateMockAction({
          url: `/category/${cid}`,
          params: { categoryUniqueId: cid }
        });
        store$.dispatch(routerAction);
      };

      selectProduct = function(cid: string, sku: string) {
        const routerAction = navigateMockAction({
          url: `/category/${cid}/product/${sku}`,
          params: {
            categoryUniqueId: cid,
            sku
          }
        });
        store$.dispatch(routerAction);
      };
    });

    it('should do nothing when product is selected', () => {
      store$.dispatch(new fromActions.LoadCategorySuccess(category));
      selectProduct('123', 'P222');

      expect(effects.productOrCategoryChanged$).toBeObservable(cold('-'));
    });

    describe('when product is not selected', () => {
      it('should do nothing when category doesnt have online products', () => {
        category.hasOnlineProducts = false;
        store$.dispatch(new fromActions.LoadCategorySuccess(category));
        selectCategory(category.uniqueId);
        expect(effects.productOrCategoryChanged$).toBeObservable(cold('-'));
      });

      it('should do nothing when category already has an SKU list', () => {
        category.productSkus = ['P222', 'P333'];
        store$.dispatch(new fromActions.LoadCategorySuccess(category));
        selectCategory(category.uniqueId);
        expect(effects.productOrCategoryChanged$).toBeObservable(cold('-'));
      });

      it('should do nothing when no category is selected', () => {
        store$.dispatch(new fromActions.LoadCategorySuccess(category));
        expect(effects.productOrCategoryChanged$).toBeObservable(cold('-'));
      });

      it('should do nothing when selected category is not in the store', () => {
        selectCategory(category.uniqueId);
        expect(effects.productOrCategoryChanged$).toBeObservable(cold('-'));
      });

      it('should trigger action of type LoadProductsForCategory when category is selected', () => {
        category.hasOnlineProducts = true;
        store$.dispatch(new fromActions.LoadCategorySuccess(category));
        selectCategory(category.uniqueId);

        const action = new productsActions.LoadProductsForCategory(category.uniqueId);
        expect(effects.productOrCategoryChanged$).toBeObservable(
          cold('a', { a: action })
        );
      });
    });
  });

  describe('saveSubCategories$', () => {
    it('should map to action of type SaveSubCategories if subcategories exist', () => {
      const category = {
        uniqueId: '123',
        subCategories: [
          { uniqueId: '456' },
          { uniqueId: '789' }
        ]
      } as Category;
      const action = new fromActions.LoadCategorySuccess(category);
      const completion = new fromActions.SaveSubCategories(category.subCategories);

      actions$ = hot('-aa-a', { a: action });
      const expected$ = cold('-cc-c', { c: completion });
      expect(effects.saveSubCategories$).toBeObservable(expected$);
    });

    it('should do nothing if no subcategories exist', () => {
      const category = { uniqueId: '123' } as Category;
      const action = new fromActions.LoadCategorySuccess(category);

      actions$ = hot('-aa-a', { a: action });
      const expected$ = cold('---');
      expect(effects.saveSubCategories$).toBeObservable(expected$);
    });
  });

});
