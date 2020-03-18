import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Action, Store, combineReducers } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, noop, of, throwError } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH } from 'ish-core/configurations/injection-keys';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category, CategoryCompletenessLevel } from 'ish-core/models/category/category.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Locale } from 'ish-core/models/locale/locale.model';
import { CategoriesService } from 'ish-core/services/categories/categories.service';
import { SetAvailableLocales } from 'ish-core/store/locale';
import { localeReducer } from 'ish-core/store/locale/locale.reducer';
import { LoadMoreProducts } from 'ish-core/store/shopping/product-listing';
import { SelectProduct } from 'ish-core/store/shopping/products/products.actions';
import { shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import * as fromActions from './categories.actions';
import { CategoriesEffects } from './categories.effects';

describe('Categories Effects', () => {
  let actions$: Observable<Action>;
  let effects: CategoriesEffects;
  let store$: Store<{}>;
  let location: Location;
  let router: Router;

  let categoriesServiceMock: CategoriesService;

  const TOP_LEVEL_CATEGORIES = categoryTree([
    { uniqueId: '123', categoryPath: ['123'] },
    { uniqueId: '456', categoryPath: ['456'] },
  ] as Category[]);

  @Component({ template: 'dummy' })
  class DummyComponent {}

  beforeEach(() => {
    categoriesServiceMock = mock(CategoriesService);
    when(categoriesServiceMock.getCategory('123')).thenReturn(
      of(categoryTree([{ uniqueId: '123', categoryPath: ['123'] } as Category]))
    );
    when(categoriesServiceMock.getCategory('invalid')).thenReturn(throwError({ message: 'invalid category' }));
    when(categoriesServiceMock.getTopLevelCategories(2)).thenReturn(of(TOP_LEVEL_CATEGORIES));
    when(categoriesServiceMock.getTopLevelCategories(-1)).thenReturn(throwError({ message: 'invalid number' }));
    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'category/:categoryUniqueId/product/:sku', component: DummyComponent },
          { path: 'category/:categoryUniqueId', component: DummyComponent },
          { path: '**', component: DummyComponent },
        ]),
        ngrxTesting({
          reducers: {
            shopping: combineReducers(shoppingReducers),
            locale: localeReducer,
          },
          routerStore: true,
        }),
      ],
      providers: [
        CategoriesEffects,
        provideMockActions(() => actions$),
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
        { provide: MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH, useValue: 1 },
      ],
    });

    effects = TestBed.get(CategoriesEffects);
    store$ = TestBed.get(Store);
    location = TestBed.get(Location);
    router = TestBed.get(Router);
  });

  describe('routeListenerForSelectingCategory$', () => {
    it('should trigger SelectCategory when /category/XXX is visited', done => {
      router.navigateByUrl('/category/dummy');

      effects.routeListenerForSelectingCategory$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Shopping] Select Category:
            categoryId: "dummy"
        `);
        done();
      });
    });

    it('should trigger SelectCategory when /category/XXX/product/YYY is visited', done => {
      router.navigateByUrl('/category/dummy/product/foobar');

      effects.routeListenerForSelectingCategory$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Shopping] Select Category:
            categoryId: "dummy"
        `);
        done();
      });
    });

    it('should not trigger SelectCategory when /something is visited', done => {
      router.navigateByUrl('/something');

      effects.routeListenerForSelectingCategory$.subscribe(fail, fail, fail);

      setTimeout(done, 1000);
    });

    it('should not trigger SelectCategory when category is already selected', done => {
      store$.dispatch(new fromActions.SelectCategory({ categoryId: 'dummy' }));

      router.navigateByUrl('/category/dummy');

      effects.routeListenerForSelectingCategory$.subscribe(fail, fail, fail);

      setTimeout(done, 1000);
    });
  });

  describe('selectedCategory$', () => {
    describe('for root categories', () => {
      let category: CategoryView;

      beforeEach(() => {
        category = {
          uniqueId: '123',
        } as CategoryView;
      });

      it('should reload category if it isnt completely loaded yet', () => {
        category.completenessLevel = 0;
        store$.dispatch(new fromActions.LoadCategorySuccess({ categories: categoryTree([category]) }));
        actions$ = hot('a', { a: new fromActions.SelectCategory({ categoryId: category.uniqueId }) });

        const completion = new fromActions.LoadCategory({ categoryId: category.uniqueId });
        const expected$ = cold('a', { a: completion });
        expect(effects.selectedCategory$).toBeObservable(expected$);
      });

      it('should do nothing if category is completely loaded', () => {
        category.completenessLevel = CategoryCompletenessLevel.Max;
        store$.dispatch(new fromActions.LoadCategorySuccess({ categories: categoryTree([category]) }));
        actions$ = hot('a', { a: new fromActions.SelectCategory({ categoryId: category.uniqueId }) });
        expect(effects.selectedCategory$).toBeObservable(cold('-'));
      });

      it('should trigger LoadCategory if not exists', () => {
        actions$ = hot('a', { a: new fromActions.SelectCategory({ categoryId: category.uniqueId }) });
        const completion = new fromActions.LoadCategory({ categoryId: category.uniqueId });
        const expected$ = cold('a', { a: completion });
        expect(effects.selectedCategory$).toBeObservable(expected$);
      });

      it('should trigger LoadCategory if category exists but subcategories have not been loaded', () => {
        category.hasChildren = () => true;
        category.completenessLevel = 0;
        store$.dispatch(new fromActions.LoadCategorySuccess({ categories: categoryTree([category]) }));
        actions$ = hot('a', { a: new fromActions.SelectCategory({ categoryId: category.uniqueId }) });

        const completion = new fromActions.LoadCategory({ categoryId: category.uniqueId });
        const expected$ = cold('a', { a: completion });
        expect(effects.selectedCategory$).toBeObservable(expected$);
      });
    });

    describe('for leaf categories', () => {
      let category: Category;

      beforeEach(() => {
        category = {
          uniqueId: '123.456.789',
        } as Category;
      });

      it('should trigger only one LoadCategory if it doesnt exist', () => {
        actions$ = hot('a', { a: new fromActions.SelectCategory({ categoryId: category.uniqueId }) });

        const completion = new fromActions.LoadCategory({ categoryId: '123.456.789' });
        const expected$ = cold('a', { a: completion });
        expect(effects.selectedCategory$).toBeObservable(expected$);
      });

      it('should not trigger LoadCategory for categories that are completely loaded', () => {
        category.completenessLevel = CategoryCompletenessLevel.Max;
        store$.dispatch(new fromActions.LoadCategorySuccess({ categories: categoryTree([category]) }));
        actions$ = hot('a', { a: new fromActions.SelectCategory({ categoryId: category.uniqueId }) });

        expect(effects.selectedCategory$).toBeObservable(cold('-----'));
      });
    });
  });

  describe('loadCategory$', () => {
    it('should call the categoriesService for LoadCategory action', done => {
      const categoryId = '123';
      const action = new fromActions.LoadCategory({ categoryId });
      actions$ = of(action);

      effects.loadCategory$.subscribe(() => {
        verify(categoriesServiceMock.getCategory(categoryId)).once();
        done();
      });
    });

    it('should map to action of type LoadCategorySuccess', () => {
      const categoryId = '123';
      const action = new fromActions.LoadCategory({ categoryId });
      const response = categoryTree([
        {
          uniqueId: categoryId,
          categoryPath: ['123'],
        } as Category,
      ]);
      const completion = new fromActions.LoadCategorySuccess({ categories: response });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadCategory$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadCategoryFail', () => {
      const categoryId = 'invalid';
      const action = new fromActions.LoadCategory({ categoryId });
      const completion = new fromActions.LoadCategoryFail({ error: { message: 'invalid category' } as HttpError });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadCategory$).toBeObservable(expected$);
    });
  });

  describe('loadTopLevelWhenUnavailable$', () => {
    const EN_US = { lang: 'en' } as Locale;
    let depth: number;

    beforeEach(() => {
      depth = TestBed.get(MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH);
      store$.dispatch(new SetAvailableLocales({ locales: [EN_US] }));
    });

    it('should load top level categories retrying for every routing action', () => {
      const completion = new fromActions.LoadTopLevelCategories({ depth });

      // tslint:disable-next-line: no-any
      actions$ = hot('        ----a---a--a', { a: routerNavigatedAction({ payload: {} as any }) });
      const expected$ = cold('----a---a--a', { a: completion });

      expect(effects.loadTopLevelWhenUnavailable$).toBeObservable(expected$);
    });

    it('should not load top level categories when already available', () => {
      store$.dispatch(new fromActions.LoadTopLevelCategoriesSuccess({ categories: categoryTree() }));

      // tslint:disable-next-line: no-any
      actions$ = hot('        ----a---a--a', { a: routerNavigatedAction({ payload: {} as any }) });
      const expected$ = cold('------------');

      expect(effects.loadTopLevelWhenUnavailable$).toBeObservable(expected$);
    });
  });

  describe('loadTopLevelCategories$', () => {
    it('should call the categoriesService for LoadTopLevelCategories action', done => {
      const depth = 2;
      const action = new fromActions.LoadTopLevelCategories({ depth });
      actions$ = of(action);

      effects.loadTopLevelCategories$.subscribe(() => {
        verify(categoriesServiceMock.getTopLevelCategories(depth)).once();
        done();
      });
    });

    it('should map to action of type LoadCategorySuccess', () => {
      const depth = 2;
      const action = new fromActions.LoadTopLevelCategories({ depth });
      const completion = new fromActions.LoadTopLevelCategoriesSuccess({ categories: TOP_LEVEL_CATEGORIES });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadTopLevelCategories$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadCategoryFail', () => {
      const depth = -1;
      const action = new fromActions.LoadTopLevelCategories({ depth });
      const completion = new fromActions.LoadTopLevelCategoriesFail({
        error: { message: 'invalid number' } as HttpError,
      });
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

    describe('when product is selected', () => {
      beforeEach(fakeAsync(() => {
        router.navigateByUrl('/category/123/product/P222');
        tick(500);
      }));

      it('should do nothing when product is selected', () => {
        store$.dispatch(new fromActions.LoadCategorySuccess({ categories: categoryTree([category]) }));
        store$.dispatch(new SelectProduct({ sku: 'P222' }));

        expect(effects.productOrCategoryChanged$).toBeObservable(cold('-'));
      });
    });

    describe('when product is not selected', () => {
      beforeEach(fakeAsync(() => {
        router.navigateByUrl('/category/123');
        tick(500);
      }));

      it("should do nothing when category doesn't have online products", () => {
        category.hasOnlineProducts = false;
        store$.dispatch(new fromActions.LoadCategorySuccess({ categories: categoryTree([category]) }));
        store$.dispatch(new fromActions.SelectCategory({ categoryId: category.uniqueId }));
        expect(effects.productOrCategoryChanged$).toBeObservable(cold('-'));
      });

      it('should do nothing when no category is selected', () => {
        store$.dispatch(new fromActions.LoadCategorySuccess({ categories: categoryTree([category]) }));
        expect(effects.productOrCategoryChanged$).toBeObservable(cold('-'));
      });

      it('should do nothing when selected category is not in the store', () => {
        store$.dispatch(new fromActions.SelectCategory({ categoryId: category.uniqueId }));
        expect(effects.productOrCategoryChanged$).toBeObservable(cold('-'));
      });

      it('should trigger action of type LoadProductsForCategory when category is selected', () => {
        category.hasOnlineProducts = true;
        store$.dispatch(new fromActions.LoadCategorySuccess({ categories: categoryTree([category]) }));
        store$.dispatch(new fromActions.SelectCategory({ categoryId: category.uniqueId }));

        const action = new LoadMoreProducts({ id: { type: 'category', value: category.uniqueId }, page: undefined });
        expect(effects.productOrCategoryChanged$).toBeObservable(cold('a', { a: action }));
      });
    });
  });

  describe('redirectIfErrorInCategories$', () => {
    it('should redirect if triggered', fakeAsync(() => {
      const action = new fromActions.LoadCategoryFail({ error: { status: 404 } as HttpError });

      actions$ = of(action);

      effects.redirectIfErrorInCategories$.subscribe(noop, fail, noop);

      tick(500);

      expect(location.path()).toEqual('/error');
    }));
  });

  describe('selectedCategoryAvailable$', () => {
    it('should not fire when selected category is not available', () => {
      store$.dispatch(new fromActions.SelectCategory({ categoryId: 'A' }));

      actions$ = of(new fromActions.SelectCategory({ categoryId: 'A' }));

      expect(effects.selectedCategoryAvailable$).toBeObservable(cold('-----'));
    });

    it('should not fire when selected category is available but not completely loaded', () => {
      store$.dispatch(
        new fromActions.LoadCategorySuccess({ categories: categoryTree([{ uniqueId: 'A' }] as Category[]) })
      );
      store$.dispatch(new fromActions.SelectCategory({ categoryId: 'A' }));

      actions$ = of(new fromActions.SelectCategory({ categoryId: 'A' }));

      expect(effects.selectedCategoryAvailable$).toBeObservable(cold('-----'));
    });

    it('should fire when selected category is available and completely loaded', () => {
      store$.dispatch(
        new fromActions.LoadCategorySuccess({
          categories: categoryTree([{ uniqueId: 'A', completenessLevel: CategoryCompletenessLevel.Max }] as Category[]),
        })
      );
      store$.dispatch(new fromActions.SelectCategory({ categoryId: 'A' }));

      actions$ = of(new fromActions.SelectCategory({ categoryId: 'A' }));

      expect(effects.selectedCategoryAvailable$).toBeObservable(
        cold('a', { a: new fromActions.SelectedCategoryAvailable({ categoryId: 'A' }) })
      );
    });

    it('should not fire twice when category is selected multiple times', () => {
      store$.dispatch(
        new fromActions.LoadCategorySuccess({
          categories: categoryTree([{ uniqueId: 'A', completenessLevel: CategoryCompletenessLevel.Max }] as Category[]),
        })
      );
      store$.dispatch(new fromActions.SelectCategory({ categoryId: 'A' }));

      actions$ = hot('-a-a-a', { a: new fromActions.SelectCategory({ categoryId: 'A' }) });

      expect(effects.selectedCategoryAvailable$).toBeObservable(
        cold('-a-----', { a: new fromActions.SelectedCategoryAvailable({ categoryId: 'A' }) })
      );
    });
  });
});
