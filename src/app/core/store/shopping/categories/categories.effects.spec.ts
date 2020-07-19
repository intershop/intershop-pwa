import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, noop, of, throwError } from 'rxjs';
import { anyNumber, capture, instance, mock, verify, when } from 'ts-mockito';

import { MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH } from 'ish-core/configurations/injection-keys';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category, CategoryCompletenessLevel, CategoryHelper } from 'ish-core/models/category/category.model';
import { CategoriesService } from 'ish-core/services/categories/categories.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
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
    when(categoriesServiceMock.getCategory('invalid')).thenReturn(
      throwError(makeHttpError({ message: 'invalid category' }))
    );
    when(categoriesServiceMock.getTopLevelCategories(anyNumber())).thenReturn(of(TOP_LEVEL_CATEGORIES));

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
          [Categories Internal] Load Category:
            categoryId: "dummy"
        `);
        done();
      });
    });

    it('should trigger LoadCategory when /category/XXX is visited and category is not completely loaded', done => {
      category.completenessLevel = 0;
      store$.dispatch(loadCategorySuccess({ categories: categoryTree([category]) }));
      router.navigateByUrl('/category/dummy');

      effects.selectedCategory$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Categories Internal] Load Category:
            categoryId: "dummy"
        `);
        done();
      });
    });

    it('should do nothing if category is completely loaded', done => {
      category.completenessLevel = CategoryCompletenessLevel.Max;
      store$.dispatch(loadCategorySuccess({ categories: categoryTree([category]) }));
      router.navigateByUrl('/category/dummy');

      effects.selectedCategory$.subscribe(fail, fail, fail);

      setTimeout(done, 1000);
    });
    it('should trigger LoadCategory if category exists but subcategories have not been loaded', done => {
      category.completenessLevel = 0;
      const subcategory = { ...category, uniqueId: `${category.uniqueId}${CategoryHelper.uniqueIdSeparator}456` };

      store$.dispatch(loadCategorySuccess({ categories: categoryTree([category, subcategory]) }));
      router.navigateByUrl('/category/dummy');

      effects.selectedCategory$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Categories Internal] Load Category:
            categoryId: "dummy"
        `);
        done();
      });
    });

    it('should trigger LoadCategory when /category/XXX/product/YYY is visited', done => {
      router.navigateByUrl('/category/dummy/product/foobar');

      effects.selectedCategory$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Categories Internal] Load Category:
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
      const action = loadCategory({ categoryId });
      actions$ = of(action);

      effects.loadCategory$.subscribe(() => {
        verify(categoriesServiceMock.getCategory(categoryId)).once();
        done();
      });
    });

    it('should map to action of type LoadCategorySuccess', () => {
      const categoryId = '123';
      const action = loadCategory({ categoryId });
      const response = categoryTree([
        {
          uniqueId: categoryId,
          categoryPath: ['123'],
        } as Category,
      ]);
      const completion = loadCategorySuccess({ categories: response });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadCategory$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadCategoryFail', () => {
      const categoryId = 'invalid';
      const action = loadCategory({ categoryId });
      const completion = loadCategoryFail({ error: makeHttpError({ message: 'invalid category' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadCategory$).toBeObservable(expected$);
    });
  });

  describe('loadTopLevelCategories$', () => {
    it('should call the categoriesService for LoadTopLevelCategories action', done => {
      const action = loadTopLevelCategories();
      actions$ = of(action);

      effects.loadTopLevelCategories$.subscribe(() => {
        verify(categoriesServiceMock.getTopLevelCategories(anyNumber())).once();
        expect(capture(categoriesServiceMock.getTopLevelCategories).last()).toMatchInlineSnapshot(`
          Array [
            1,
          ]
        `);
        done();
      });
    });

    it('should map to action of type LoadCategorySuccess', () => {
      const action = loadTopLevelCategories();
      const completion = loadTopLevelCategoriesSuccess({ categories: TOP_LEVEL_CATEGORIES });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadTopLevelCategories$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadCategoryFail', () => {
      when(categoriesServiceMock.getTopLevelCategories(anyNumber())).thenReturn(
        throwError(makeHttpError({ message: 'invalid number' }))
      );
      const action = loadTopLevelCategories();
      const completion = loadTopLevelCategoriesFail({
        error: makeHttpError({ message: 'invalid number' }),
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadTopLevelCategories$).toBeObservable(expected$);
    });
  });

  describe('redirectIfErrorInCategories$', () => {
    it('should redirect if triggered', fakeAsync(() => {
      const action = loadCategoryFail({ error: makeHttpError({ status: 404 }) });

      actions$ = of(action);

      effects.redirectIfErrorInCategories$.subscribe(noop, fail, noop);

      tick(500);

      expect(location.path()).toEqual('/error');
    }));
  });
});
