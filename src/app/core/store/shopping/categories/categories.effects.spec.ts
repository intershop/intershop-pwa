import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, noop, of, throwError } from 'rxjs';
import { anyNumber, anything, capture, instance, mock, spy, verify, when } from 'ts-mockito';

import { MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH } from 'ish-core/configurations/injection-keys';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category, CategoryCompletenessLevel, CategoryHelper } from 'ish-core/models/category/category.model';
import { CategoriesService } from 'ish-core/services/categories/categories.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { personalizationStatusDetermined } from 'ish-core/store/customer/user';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';
import { HttpStatusCodeService } from 'ish-core/utils/http-status-code/http-status-code.service';

import {
  loadCategory,
  loadCategoryByRef,
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
  let store: Store;
  let router: Router;
  let httpStatusCodeService: HttpStatusCodeService;

  let categoriesServiceMock: CategoriesService;

  const TOP_LEVEL_CATEGORIES = categoryTree([
    { uniqueId: '123', categoryPath: ['123'] },
    { uniqueId: '456', categoryPath: ['456'] },
  ] as Category[]);

  beforeEach(() => {
    categoriesServiceMock = mock(CategoriesService);
    when(categoriesServiceMock.getCategory('123')).thenReturn(
      of(categoryTree([{ uniqueId: '123', categoryPath: ['123'] } as Category]))
    );
    when(categoriesServiceMock.getCategory('123@domain')).thenReturn(
      of(categoryTree([{ uniqueId: '123', categoryRef: '123@domain', categoryPath: ['123'] } as Category]))
    );
    when(categoriesServiceMock.getCategory('invalid')).thenReturn(
      throwError(() => makeHttpError({ message: 'invalid category' }))
    );
    when(categoriesServiceMock.getTopLevelCategories(anyNumber())).thenReturn(of(TOP_LEVEL_CATEGORIES));

    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['router']),
        RouterTestingModule.withRoutes([
          { path: 'category/:categoryUniqueId/product/:sku', children: [] },
          { path: 'category/:categoryUniqueId', children: [] },
          { path: 'categoryref/:categoryRefId', children: [] },
          { path: '**', children: [] },
        ]),
        ShoppingStoreModule.forTesting('categories'),
      ],
      providers: [
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
        { provide: MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH, useValue: 1 },
        CategoriesEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(CategoriesEffects);
    store = TestBed.inject(Store);
    router = TestBed.inject(Router);
    httpStatusCodeService = spy(TestBed.inject(HttpStatusCodeService));
  });

  describe('selectedCategoryRef$', () => {
    let category: CategoryView;

    beforeEach(() => {
      category = {
        uniqueId: 'dummy',
        categoryRef: 'dummy@domain',
      } as CategoryView;
      actions$ = of(personalizationStatusDetermined());
    });
    it('should trigger loadCategoryByRef when /categoryref/XXX is visited', done => {
      router.navigateByUrl('/categoryref/dummy@domain');

      effects.selectedCategoryRef$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Categories Internal] Load Category By Reference:
            categoryId: "dummy@domain"
        `);
        done();
      });
    });

    it('should do nothing if category is completely loaded', fakeAsync(() => {
      category.completenessLevel = CategoryCompletenessLevel.Max;
      store.dispatch(loadCategorySuccess({ categories: categoryTree([category]) }));
      router.navigateByUrl('/categoryref/dummy@domain');

      effects.selectedCategoryRef$.subscribe({ next: fail, error: fail });

      tick(2000);
    }));
  });

  describe('selectedCategory$', () => {
    let category: CategoryView;

    beforeEach(() => {
      category = {
        uniqueId: 'dummy',
        categoryRef: 'dummy@domain',
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
      store.dispatch(loadCategorySuccess({ categories: categoryTree([category]) }));
      router.navigateByUrl('/category/dummy');

      effects.selectedCategory$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Categories Internal] Load Category:
            categoryId: "dummy"
        `);
        done();
      });
    });

    it('should do nothing if category is completely loaded', fakeAsync(() => {
      category.completenessLevel = CategoryCompletenessLevel.Max;
      store.dispatch(loadCategorySuccess({ categories: categoryTree([category]) }));
      router.navigateByUrl('/category/dummy');

      effects.selectedCategory$.subscribe({ next: fail, error: fail });

      tick(2000);
    }));

    it('should trigger LoadCategory if category exists but subcategories have not been loaded', done => {
      category.completenessLevel = 0;
      const subcategory = { ...category, uniqueId: `${category.uniqueId}${CategoryHelper.uniqueIdSeparator}456` };

      store.dispatch(loadCategorySuccess({ categories: categoryTree([category, subcategory]) }));
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

    it('should not trigger LoadCategory when /something is visited', fakeAsync(() => {
      router.navigateByUrl('/something');

      effects.selectedCategory$.subscribe({ next: fail, error: fail });

      tick(2000);
    }));
  });

  describe('loadCategory$', () => {
    it('should call the categoriesService for LoadCategoryByRef action', done => {
      const categoryId = '123@domain';
      const action = loadCategoryByRef({ categoryId });
      actions$ = of(action);

      effects.loadCategory$.subscribe(() => {
        verify(categoriesServiceMock.getCategory(categoryId)).once();
        done();
      });
    });

    it('should map to action of type LoadCategorySuccess', () => {
      const categoryId = '123@domain';
      const action = loadCategoryByRef({ categoryId });
      const response = categoryTree([
        {
          uniqueId: '123',
          categoryRef: categoryId,
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
      const action = loadCategoryByRef({ categoryId });
      const completion = loadCategoryFail({ error: makeHttpError({ message: 'invalid category' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadCategory$).toBeObservable(expected$);
    });

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
      actions$ = of(personalizationStatusDetermined(), action);

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
      actions$ = hot('b-a-a-a', { a: action, b: personalizationStatusDetermined() });
      const expected$ = cold('--c-c-c', { c: completion });

      expect(effects.loadTopLevelCategories$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type LoadCategoryFail', () => {
      when(categoriesServiceMock.getTopLevelCategories(anyNumber())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid number' }))
      );
      const action = loadTopLevelCategories();
      const completion = loadTopLevelCategoriesFail({
        error: makeHttpError({ message: 'invalid number' }),
      });
      actions$ = hot('b-a-a-a', { a: action, b: personalizationStatusDetermined() });
      const expected$ = cold('--c-c-c', { c: completion });

      expect(effects.loadTopLevelCategories$).toBeObservable(expected$);
    });
  });

  describe('redirectIfErrorInCategories$', () => {
    it('should call error service if triggered', done => {
      actions$ = of(loadCategoryFail({ error: makeHttpError({ status: 404 }) }));

      effects.redirectIfErrorInCategories$.subscribe({
        next: () => {
          verify(httpStatusCodeService.setStatus(anything())).once();
          expect(capture(httpStatusCodeService.setStatus).last()).toMatchInlineSnapshot(`
                      Array [
                        404,
                      ]
                  `);
          done();
        },
        error: fail,
        complete: noop,
      });
    });
  });
});
