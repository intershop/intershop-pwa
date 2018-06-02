import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { RouteNavigation } from 'ngrx-router';
import { Observable, of, throwError } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';
import { capture } from 'ts-mockito/lib/ts-mockito';
import { MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH } from '../../../core/configurations/injection-keys';
import { SelectLocale, SetAvailableLocales } from '../../../core/store/locale';
import { localeReducer } from '../../../core/store/locale/locale.reducer';
import { Category, CategoryHelper } from '../../../models/category/category.model';
import { Locale } from '../../../models/locale/locale.model';
import { categoryTree } from '../../../utils/dev/test-data-utils';
import { CategoriesService } from '../../services/categories/categories.service';
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

  let router: Router;

  const TOP_LEVEL_CATEGORIES = categoryTree([
    { uniqueId: '123', categoryPath: ['123'] },
    { uniqueId: '456', categoryPath: ['456'] },
  ] as Category[]);

  beforeEach(() => {
    categoriesServiceMock = mock(CategoriesService);
    when(categoriesServiceMock.getCategory('123')).thenReturn(
      of(categoryTree([{ uniqueId: '123', categoryPath: ['123'] } as Category]))
    );
    when(categoriesServiceMock.getCategory('invalid')).thenReturn(
      throwError({ message: 'invalid category' } as HttpErrorResponse)
    );
    when(categoriesServiceMock.getTopLevelCategories(2)).thenCall(() => {
      return of(TOP_LEVEL_CATEGORIES);
    });
    when(categoriesServiceMock.getTopLevelCategories(-1)).thenReturn(
      throwError({ message: 'invalid number' } as HttpErrorResponse)
    );
    router = mock(Router);
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({
          shopping: combineReducers(shoppingReducers),
          locale: localeReducer,
        }),
      ],
      providers: [
        CategoriesEffects,
        provideMockActions(() => actions$),
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
        { provide: Router, useFactory: () => instance(router) },
        { provide: MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH, useValue: 1 },
      ],
    });

    effects = TestBed.get(CategoriesEffects);
    store$ = TestBed.get(Store);
  });

  describe('routeListenerForSelectingCategory$', () => {
    it('should trigger SelectCategory when /category/XXX is visited', () => {
      const action = new RouteNavigation({
        path: 'category/:categoryUniqueId',
        params: { categoryUniqueId: 'dummy' },
        queryParams: {},
      });
      const expected = new fromActions.SelectCategory('dummy');

      actions$ = hot('a', { a: action });
      expect(effects.routeListenerForSelectingCategory$).toBeObservable(cold('a', { a: expected }));
    });

    it('should trigger SelectCategory when /category/XXX/product/YYY is visited', () => {
      const action = new RouteNavigation({
        path: 'category/:categoryUniqueId/product/:sku',
        params: { categoryUniqueId: 'dummy', sku: 'foobar' },
        queryParams: {},
      });
      const expected = new fromActions.SelectCategory('dummy');

      actions$ = hot('a', { a: action });
      expect(effects.routeListenerForSelectingCategory$).toBeObservable(cold('a', { a: expected }));
    });

    it('should not trigger SelectCategory when /something is visited', () => {
      const action = new RouteNavigation({
        path: 'something',
        params: {},
        queryParams: {},
      });

      actions$ = hot('a', { a: action });
      expect(effects.routeListenerForSelectingCategory$).toBeObservable(cold('-'));
    });

    it('should not trigger SelectCategory when category is already selected', () => {
      store$.dispatch(new fromActions.SelectCategory('dummy'));

      const action = new RouteNavigation({
        path: 'category/:categoryUniqueId',
        params: { categoryUniqueId: 'dummy' },
        queryParams: {},
      });

      actions$ = hot('a', { a: action });
      expect(effects.routeListenerForSelectingCategory$).toBeObservable(cold('-'));
    });
  });

  describe('selectedCategory$', () => {
    it('should do nothing for undefined category id', () => {
      actions$ = hot('a', { a: new fromActions.SelectCategory(undefined) });
      expect(effects.selectedCategory$).toBeObservable(cold('-'));
    });

    describe('for root categories', () => {
      let category: Category;

      beforeEach(() => {
        category = {
          uniqueId: '123',
          hasOnlineSubCategories: false,
        } as Category;
      });

      it('should reload category if it isnt completely loaded yet', () => {
        category.completenessLevel = 0;
        store$.dispatch(new fromActions.LoadCategorySuccess(categoryTree([category])));
        actions$ = hot('a', { a: new fromActions.SelectCategory(category.uniqueId) });

        const completion = new fromActions.LoadCategory(category.uniqueId);
        const expected$ = cold('a', { a: completion });
        expect(effects.selectedCategory$).toBeObservable(expected$);
      });

      it('should do nothing if category is completely loaded', () => {
        category.completenessLevel = 2;
        store$.dispatch(new fromActions.LoadCategorySuccess(categoryTree([category])));
        actions$ = hot('a', { a: new fromActions.SelectCategory(category.uniqueId) });
        expect(effects.selectedCategory$).toBeObservable(cold('-'));
      });

      it('should trigger LoadCategory if not exists', () => {
        actions$ = hot('a', { a: new fromActions.SelectCategory(category.uniqueId) });
        const completion = new fromActions.LoadCategory(category.uniqueId);
        const expected$ = cold('a', { a: completion });
        expect(effects.selectedCategory$).toBeObservable(expected$);
      });

      it('should trigger LoadCategory if category exists but subcategories have not been loaded', () => {
        category.hasOnlineSubCategories = true;
        category.completenessLevel = 0;
        store$.dispatch(new fromActions.LoadCategorySuccess(categoryTree([category])));
        actions$ = hot('a', { a: new fromActions.SelectCategory(category.uniqueId) });

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
          hasOnlineSubCategories: false,
        } as Category;
      });

      it('should trigger only one LoadCategory if it doesnt exist', () => {
        actions$ = hot('a', { a: new fromActions.SelectCategory(category.uniqueId) });

        const completion = new fromActions.LoadCategory('123.456.789');
        const expected$ = cold('a', { a: completion });
        expect(effects.selectedCategory$).toBeObservable(expected$);
      });

      it('should not trigger LoadCategory for categories that are completely loaded', () => {
        category.completenessLevel = 2;
        store$.dispatch(new fromActions.LoadCategorySuccess(categoryTree([category])));
        actions$ = hot('a', { a: new fromActions.SelectCategory(category.uniqueId) });

        expect(effects.selectedCategory$).toBeObservable(cold('-----'));
      });
    });
  });

  describe('loadCategory$', () => {
    it('should call the categoriesService for LoadCategory action', done => {
      const categoryId = '123';
      const action = new fromActions.LoadCategory(categoryId);
      actions$ = of(action);

      effects.loadCategory$.subscribe(() => {
        verify(categoriesServiceMock.getCategory(categoryId)).once();
        done();
      });
    });

    it('should map to action of type LoadCategorySuccess', () => {
      const categoryId = '123';
      const action = new fromActions.LoadCategory(categoryId);
      const response = categoryTree([
        {
          uniqueId: categoryId,
          categoryPath: ['123'],
        } as Category,
      ]);
      const completion = new fromActions.LoadCategorySuccess(response);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadCategory$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadCategoryFail', () => {
      const categoryId = 'invalid';
      const action = new fromActions.LoadCategory(categoryId);
      const completion = new fromActions.LoadCategoryFail({ message: 'invalid category' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadCategory$).toBeObservable(expected$);
    });
  });

  describe('loadTopLevelCategoriesOnLanguageChange$', () => {
    const EN_US = { lang: 'en' } as Locale;
    let depth: number;

    beforeEach(() => {
      depth = TestBed.get(MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH);
      store$.dispatch(new SetAvailableLocales([EN_US]));
    });

    it('should trigger when language is changed', () => {
      const action = new SelectLocale(EN_US);
      const completion = new fromActions.LoadTopLevelCategories(depth);
      actions$ = hot('a', { a: action });
      const expected$ = cold('c', { c: completion });

      expect(effects.loadTopLevelCategoriesOnLanguageChange$).toBeObservable(expected$);
    });
  });

  describe('loadTopLevelCategories$', () => {
    it('should call the categoriesService for LoadTopLevelCategories action', done => {
      const limit = 2;
      const action = new fromActions.LoadTopLevelCategories(limit);
      actions$ = of(action);

      effects.loadTopLevelCategories$.subscribe(() => {
        verify(categoriesServiceMock.getTopLevelCategories(limit)).once();
        done();
      });
    });

    it('should map to action of type LoadCategorySuccess', () => {
      const limit = 2;
      const action = new fromActions.LoadTopLevelCategories(limit);
      const completion = new fromActions.LoadTopLevelCategoriesSuccess(TOP_LEVEL_CATEGORIES);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadTopLevelCategories$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadCategoryFail', () => {
      const limit = -1;
      const action = new fromActions.LoadTopLevelCategories(limit);
      const completion = new fromActions.LoadTopLevelCategoriesFail({ message: 'invalid number' } as HttpErrorResponse);
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadTopLevelCategories$).toBeObservable(expected$);
    });
  });

  describe('productOrCategoryChanged$', () => {
    let category: Category;

    beforeEach(() => {
      category = {
        uniqueId: '123',
        hasOnlineProducts: false,
      } as Category;
    });

    it('should do nothing when product is selected', () => {
      store$.dispatch(new fromActions.LoadCategorySuccess(categoryTree([category])));
      store$.dispatch(new productsActions.SelectProduct('P222'));

      expect(effects.productOrCategoryChanged$).toBeObservable(cold('-'));
    });

    describe('when product is not selected', () => {
      it('should do nothing when category doesnt have online products', () => {
        category.hasOnlineProducts = false;
        store$.dispatch(new fromActions.LoadCategorySuccess(categoryTree([category])));
        store$.dispatch(new fromActions.SelectCategory(category.uniqueId));
        expect(effects.productOrCategoryChanged$).toBeObservable(cold('-'));
      });

      it('should do nothing when category already has an SKU list', () => {
        store$.dispatch(new fromActions.SetProductSkusForCategory(category.uniqueId, ['P222', 'P333']));
        store$.dispatch(new fromActions.LoadCategorySuccess(categoryTree([category])));
        store$.dispatch(new fromActions.SelectCategory(category.uniqueId));
        expect(effects.productOrCategoryChanged$).toBeObservable(cold('-'));
      });

      it('should do nothing when no category is selected', () => {
        store$.dispatch(new fromActions.LoadCategorySuccess(categoryTree([category])));
        expect(effects.productOrCategoryChanged$).toBeObservable(cold('-'));
      });

      it('should do nothing when selected category is not in the store', () => {
        store$.dispatch(new fromActions.SelectCategory(category.uniqueId));
        expect(effects.productOrCategoryChanged$).toBeObservable(cold('-'));
      });

      it('should trigger action of type LoadProductsForCategory when category is selected', () => {
        category.hasOnlineProducts = true;
        store$.dispatch(new fromActions.LoadCategorySuccess(categoryTree([category])));
        store$.dispatch(new fromActions.SelectCategory(category.uniqueId));

        actions$ = hot('(ab)', {
          a: new RouteNavigation({
            path: 'category/:categoryUniqueId',
            params: { categoryUniqueId: category.uniqueId },
            queryParams: {},
          }),
          b: new fromActions.SelectedCategoryAvailable(category.uniqueId),
        });

        const action = new productsActions.LoadProductsForCategory(category.uniqueId);
        expect(effects.productOrCategoryChanged$).toBeObservable(cold('a', { a: action }));
      });

      it('should not trigger action when we are on a product page', () => {
        category.hasOnlineProducts = true;
        store$.dispatch(new fromActions.LoadCategorySuccess(categoryTree([category])));
        store$.dispatch(new fromActions.SelectCategory(category.uniqueId));

        actions$ = hot('(ab)', {
          a: new RouteNavigation({
            path: 'category/:categoryUniqueId/product/:sku',
            params: { categoryUniqueId: category.uniqueId, sku: 'dummy' },
            queryParams: {},
          }),
          b: new fromActions.SelectedCategoryAvailable(category.uniqueId),
        });

        expect(effects.productOrCategoryChanged$).toBeObservable(cold('------'));
      });
    });
  });

  describe('redirectIfErrorInCategories$', () => {
    it('should redirect if triggered', done => {
      const action = new fromActions.LoadCategoryFail({ status: 404 } as HttpErrorResponse);

      actions$ = of(action);

      effects.redirectIfErrorInCategories$.subscribe(() => {
        verify(router.navigate(anything())).once();
        const [param] = capture(router.navigate).last();
        expect(param).toEqual(['/error']);
        done();
      });
    });
  });

  describe('selectedCategoryAvailable$', () => {
    it('should not fire when selected category is not available', () => {
      store$.dispatch(new fromActions.SelectCategory('A'));

      actions$ = of(new fromActions.SelectCategory('A'));

      expect(effects.selectedCategoryAvailable$).toBeObservable(cold('-----'));
    });

    it('should not fire when selected category is available but not completely loaded', () => {
      store$.dispatch(new fromActions.LoadCategorySuccess(categoryTree([{ uniqueId: 'A' }] as Category[])));
      store$.dispatch(new fromActions.SelectCategory('A'));

      actions$ = of(new fromActions.SelectCategory('A'));

      expect(effects.selectedCategoryAvailable$).toBeObservable(cold('-----'));
    });

    it('should fire when selected category is available and completely loaded', () => {
      store$.dispatch(
        new fromActions.LoadCategorySuccess(
          categoryTree([{ uniqueId: 'A', completenessLevel: CategoryHelper.maxCompletenessLevel }] as Category[])
        )
      );
      store$.dispatch(new fromActions.SelectCategory('A'));

      actions$ = of(new fromActions.SelectCategory('A'));

      expect(effects.selectedCategoryAvailable$).toBeObservable(
        cold('a', { a: new fromActions.SelectedCategoryAvailable('A') })
      );
    });

    it('should not fire twice when category is selected multiple times', () => {
      store$.dispatch(
        new fromActions.LoadCategorySuccess(
          categoryTree([{ uniqueId: 'A', completenessLevel: CategoryHelper.maxCompletenessLevel }] as Category[])
        )
      );
      store$.dispatch(new fromActions.SelectCategory('A'));

      actions$ = hot('-a-a-a', { a: new fromActions.SelectCategory('A') });

      expect(effects.selectedCategoryAvailable$).toBeObservable(
        cold('-a-----', { a: new fromActions.SelectedCategoryAvailable('A') })
      );
    });
  });
});
