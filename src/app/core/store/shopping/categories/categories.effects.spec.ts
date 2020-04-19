import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, noop, of, throwError } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH } from 'ish-core/configurations/injection-keys';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category, CategoryCompletenessLevel, CategoryHelper } from 'ish-core/models/category/category.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { CategoriesService } from 'ish-core/services/categories/categories.service';
import { CoreStoreModule } from 'ish-core/store/core-store.module';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import * as fromActions from './categories.actions';
import { CategoriesEffects } from './categories.effects';

describe('Categories Effects', () => {
  let actions$: Observable<Action>;
  let effects: CategoriesEffects;
  let store$: Store;
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
        CoreStoreModule.forTesting(['router']),
        RouterTestingModule.withRoutes([
          { path: 'category/:categoryUniqueId/product/:sku', component: DummyComponent },
          { path: 'category/:categoryUniqueId', component: DummyComponent },
          { path: '**', component: DummyComponent },
        ]),
        ShoppingStoreModule.forTesting('categories'),
      ],
      providers: [
        CategoriesEffects,
        provideMockActions(() => actions$),
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
        { provide: MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH, useValue: 1 },
      ],
    });

    effects = TestBed.inject(CategoriesEffects);
    store$ = TestBed.inject(Store);
    location = TestBed.inject(Location);
    router = TestBed.inject(Router);
  });

  describe('selectedCategory$', () => {
    let category: CategoryView;

    beforeEach(() => {
      category = {
        uniqueId: 'dummy',
      } as CategoryView;
    });

    it('should trigger LoadCategory when /category/XXX is visited', done => {
      router.navigateByUrl('/category/dummy');

      effects.selectedCategory$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Shopping] Load Category:
            categoryId: "dummy"
        `);
        done();
      });
    });

    it('should trigger LoadCategory when /category/XXX is visited and category is not completely loaded', done => {
      category.completenessLevel = 0;
      store$.dispatch(new fromActions.LoadCategorySuccess({ categories: categoryTree([category]) }));
      router.navigateByUrl('/category/dummy');

      effects.selectedCategory$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Shopping] Load Category:
            categoryId: "dummy"
        `);
        done();
      });
    });

    it('should do nothing if category is completely loaded', done => {
      category.completenessLevel = CategoryCompletenessLevel.Max;
      store$.dispatch(new fromActions.LoadCategorySuccess({ categories: categoryTree([category]) }));
      router.navigateByUrl('/category/dummy');

      effects.selectedCategory$.subscribe(fail, fail, fail);

      setTimeout(done, 1000);
    });
    it('should trigger LoadCategory if category exists but subcategories have not been loaded', done => {
      category.completenessLevel = 0;
      const subcategory = { ...category, uniqueId: `${category.uniqueId}${CategoryHelper.uniqueIdSeparator}456` };

      store$.dispatch(new fromActions.LoadCategorySuccess({ categories: categoryTree([category, subcategory]) }));
      router.navigateByUrl('/category/dummy');

      effects.selectedCategory$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Shopping] Load Category:
            categoryId: "dummy"
        `);
        done();
      });
    });

    it('should trigger LoadCategory when /category/XXX/product/YYY is visited', done => {
      router.navigateByUrl('/category/dummy/product/foobar');

      effects.selectedCategory$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Shopping] Load Category:
            categoryId: "dummy"
        `);
        done();
      });
    });

    it('should not trigger LoadCategory when /something is visited', done => {
      router.navigateByUrl('/something');

      effects.selectedCategory$.subscribe(fail, fail, fail);

      setTimeout(done, 1000);
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
    let depth: number;

    beforeEach(() => {
      depth = TestBed.inject(MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH);
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

  describe('redirectIfErrorInCategories$', () => {
    it('should redirect if triggered', fakeAsync(() => {
      const action = new fromActions.LoadCategoryFail({ error: { status: 404 } as HttpError });

      actions$ = of(action);

      effects.redirectIfErrorInCategories$.subscribe(noop, fail, noop);

      tick(500);

      expect(location.path()).toEqual('/error');
    }));
  });
});
