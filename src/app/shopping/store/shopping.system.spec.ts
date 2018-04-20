// tslint:disable use-component-change-detection prefer-mocks-instead-of-stubs-in-tests
import { Component } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { combineReducers, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { getTestScheduler } from 'jasmine-marbles';
import { ROUTER_NAVIGATION_TYPE } from 'ngrx-router';
import { empty } from 'rxjs/observable/empty';
import { of } from 'rxjs/observable/of';
import { _throw } from 'rxjs/observable/throw';
import { Scheduler } from 'rxjs/Scheduler';
import { anyNumber, anyString, anything, instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { AVAILABLE_LOCALES, MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH } from '../../core/configurations/injection-keys';
import { CountryService } from '../../core/services/countries/country.service';
import { coreEffects, coreReducers } from '../../core/store/core.system';
import { SelectLocale } from '../../core/store/locale';
import { CategoryData } from '../../models/category/category.interface';
import { CategoryMapper } from '../../models/category/category.mapper';
import { Category } from '../../models/category/category.model';
import { Locale } from '../../models/locale/locale.model';
import { RegistrationService } from '../../registration/services/registration/registration.service';
import { LogEffects } from '../../utils/dev/log.effects';
import { CategoriesService } from '../services/categories/categories.service';
import { ProductsService } from '../services/products/products.service';
import { SuggestService } from '../services/suggest/suggest.service';
import { CategoriesActionTypes, getCategoriesIds, LoadCategory, SelectCategory } from './categories';
import { getProductIds, LoadProduct, ProductsActionTypes, SelectProduct } from './products';
import { RecentlyActionTypes } from './recently';
import { shoppingEffects, shoppingReducers } from './shopping.system';
import { ViewconfActionTypes } from './viewconf';

describe('Shopping Store', () => {
  const DEBUG = false;
  let store: LogEffects;
  let router: Router;
  let categoriesServiceMock: CategoriesService;
  let productsServiceMock: ProductsService;
  let locales: Locale[];

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    locales = [
      { lang: 'en_US', currency: 'USD', value: 'en' },
      { lang: 'de_DE', currency: 'EUR', value: 'de' },
      { lang: 'fr_FR', currency: 'EUR', value: 'fr' },
    ] as Locale[];

    categoriesServiceMock = mock(CategoriesService);
    when(categoriesServiceMock.getTopLevelCategories(anyNumber())).thenReturn(
      of([
        CategoryMapper.fromData({
          id: 'A',
          hasOnlineSubCategories: true,
          hasOnlineProducts: false,
          subCategoriesCount: 1,
          subCategories: [
            {
              id: '123',
              hasOnlineSubCategories: true,
              hasOnlineProducts: false,
            },
          ],
        } as CategoryData),
        {
          uniqueId: 'B',
          id: 'B',
          hasOnlineSubCategories: false,
          hasOnlineProducts: false,
        },
      ] as Category[])
    );
    when(categoriesServiceMock.getCategory(anything())).thenCall(uniqueId => {
      switch (uniqueId) {
        case 'A':
          return of(<Category>{
            uniqueId: 'A',
            id: 'A',
            hasOnlineSubCategories: true,
            hasOnlineProducts: false,
          });
        case 'B':
          return of(<Category>{
            uniqueId: 'B',
            id: 'B',
            hasOnlineSubCategories: false,
            hasOnlineProducts: false,
          });
        case 'A.123':
          return of(<Category>{
            uniqueId: 'A.123',
            id: '123',
            hasOnlineSubCategories: true,
            hasOnlineProducts: false,
          });
        case 'A.123.456':
          return of(<Category>{
            uniqueId: 'A.123.456',
            id: '456',
            hasOnlineSubCategories: false,
            hasOnlineProducts: true,
          });
        default:
          return _throw(`error loading category ${uniqueId}`);
      }
    });

    const countryServiceMock = mock(CountryService);
    when(countryServiceMock.getCountries()).thenReturn(empty());

    productsServiceMock = mock(ProductsService);
    when(productsServiceMock.getProduct(anyString())).thenCall(sku => {
      if (['P1', 'P2'].find(x => x === sku)) {
        return of({ sku });
      } else {
        return _throw(`error loading product ${sku}`);
      }
    });
    when(productsServiceMock.getCategoryProducts('A.123.456', anything())).thenReturn(
      of({
        skus: ['P1', 'P2'],
        categoryUniqueId: 'A.123.456',
        sortKeys: [],
      })
    );

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        StoreModule.forRoot({
          ...coreReducers,
          shopping: combineReducers(shoppingReducers),
        }),
        EffectsModule.forRoot([...coreEffects, ...shoppingEffects, LogEffects]),
        RouterTestingModule.withRoutes([
          {
            path: 'home',
            component: DummyComponent,
          },
          {
            path: 'category/:categoryUniqueId',
            component: DummyComponent,
          },
          {
            path: 'category/:categoryUniqueId/product/:sku',
            component: DummyComponent,
          },
        ]),
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
        { provide: CountryService, useFactory: () => instance(countryServiceMock) },
        { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
        { provide: RegistrationService, useFactory: () => instance(mock(RegistrationService)) },
        { provide: SuggestService, useFactory: () => instance(mock(SuggestService)) },
        { provide: Scheduler, useFactory: getTestScheduler },
        { provide: MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH, useValue: 1 },
        { provide: AVAILABLE_LOCALES, useValue: locales },
      ],
    });

    store = TestBed.get(LogEffects);
    store.logActions = DEBUG;
    store.logState = DEBUG;
    router = TestBed.get(Router);
    locales = TestBed.get(AVAILABLE_LOCALES);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('home page', () => {
    beforeEach(
      fakeAsync(() => {
        router.navigate(['/home']);
        tick(5000);
      })
    );

    it(
      'should just load toplevel categories when no specific shopping page is loaded',
      fakeAsync(() => {
        const i = store.actionsIterator(['[Shopping]']);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategories);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategoriesSuccess);
        expect(i.next()).toBeUndefined();

        expect(getCategoriesIds(store.state)).toEqual(['A.123', 'A', 'B']);
        expect(getProductIds(store.state)).toEqual([]);
      })
    );

    describe('and changing the language', () => {
      beforeEach(
        fakeAsync(() => {
          store.reset();
          store.dispatch(new SelectLocale(locales[1]));
          tick(5000);
        })
      );

      it(
        'should just reload top level categories when language is changed',
        fakeAsync(() => {
          const i = store.actionsIterator(['[Shopping]']);
          expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategories);
          expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategoriesSuccess);
          expect(i.next()).toBeUndefined();
        })
      );
    });
  });

  describe('category page', () => {
    beforeEach(
      fakeAsync(() => {
        router.navigate(['/category', 'A.123']);
        tick(5000);
      })
    );

    it(
      'should load necessary data when going to a category page',
      fakeAsync(() => {
        expect(getCategoriesIds(store.state)).toEqual(['A', 'A.123', 'B']);
        expect(getProductIds(store.state)).toEqual([]);
      })
    );

    it(
      'should have toplevel loading and category loading actions when going to a category page',
      fakeAsync(() => {
        const i = store.actionsIterator(['[Shopping]', '[Router]']);
        expect(i.next().type).toEqual(ROUTER_NAVIGATION_TYPE);
        expect(i.next()).toEqual(new SelectCategory('A.123'));
        expect(i.next()).toEqual(new LoadCategory('A'));
        expect(i.next()).toEqual(new LoadCategory('A.123'));
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategories);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategoriesSuccess);
        expect(i.next()).toBeUndefined();
      })
    );

    describe('and changing the language', () => {
      beforeEach(
        fakeAsync(() => {
          store.reset();
          store.dispatch(new SelectLocale(locales[1]));
          tick(5000);
        })
      );

      it(
        'should just reload top level categories when language is changed',
        fakeAsync(() => {
          const i = store.actionsIterator(['[Shopping]']);
          expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategories);
          expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategoriesSuccess);
          expect(i.next()).toBeUndefined();
        })
      );
    });
  });

  describe('family page', () => {
    beforeEach(
      fakeAsync(() => {
        router.navigate(['/category', 'A.123.456']);
        tick(5000);
      })
    );

    it(
      'should load all products and required categories when going to a family page',
      fakeAsync(() => {
        expect(getCategoriesIds(store.state)).toEqual(['A', 'A.123', 'A.123.456', 'B']);
        expect(getProductIds(store.state)).toEqual(['P1', 'P2']);
      })
    );

    it(
      'should have all required actions when going to a family page',
      fakeAsync(() => {
        const i = store.actionsIterator(['[Shopping]']);
        expect(i.next()).toEqual(new SelectCategory('A.123.456'));
        expect(i.next()).toEqual(new LoadCategory('A'));
        expect(i.next()).toEqual(new LoadCategory('A.123'));
        expect(i.next()).toEqual(new LoadCategory('A.123.456'));
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategories);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategoriesSuccess);
        expect(i.next().type).toEqual(ProductsActionTypes.LoadProductsForCategory);
        expect(i.next().type).toEqual(CategoriesActionTypes.SetProductSkusForCategory);
        expect(i.next().type).toEqual(ViewconfActionTypes.SetSortKeys);
        expect(i.next()).toEqual(new LoadProduct('P1'));
        expect(i.next()).toEqual(new LoadProduct('P2'));
        expect(i.next().type).toEqual(ProductsActionTypes.LoadProductSuccess);
        expect(i.next().type).toEqual(ProductsActionTypes.LoadProductSuccess);
        expect(i.next()).toBeUndefined();
      })
    );

    describe('and clicking a product', () => {
      beforeEach(
        fakeAsync(() => {
          store.reset();
          router.navigate(['/category', 'A.123.456', 'product', 'P1']);
          tick(5000);
        })
      );

      it(
        'should reload the product when selected',
        fakeAsync(() => {
          const i = store.actionsIterator(['[Shopping]']);
          expect(i.next()).toEqual(new SelectProduct('P1'));
          expect(i.next().type).toEqual(RecentlyActionTypes.AddToRecently);
          expect(i.next()).toEqual(new LoadProduct('P1'));
          expect(i.next().type).toEqual(ProductsActionTypes.LoadProductSuccess);
          expect(i.next()).toBeUndefined();
        })
      );

      describe('and and going back to the family page', () => {
        beforeEach(
          fakeAsync(() => {
            store.reset();
            router.navigate(['/category', 'A.123.456']);
            tick(5000);
          })
        );

        it(
          'should have all required data when previously visited',
          fakeAsync(() => {
            const i = store.actionsIterator(['[Shopping]']);
            expect(i.next()).toEqual(new SelectProduct(undefined));
            expect(i.next()).toBeUndefined();
          })
        );
      });
    });

    describe('and changing the language', () => {
      beforeEach(
        fakeAsync(() => {
          store.reset();
          store.dispatch(new SelectLocale(locales[1]));
          tick(5000);
        })
      );

      it(
        'should just reload top level categories when language is changed',
        fakeAsync(() => {
          const i = store.actionsIterator(['[Shopping]']);
          expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategories);
          expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategoriesSuccess);
          expect(i.next()).toBeUndefined();
        })
      );
    });
  });

  describe('product page', () => {
    beforeEach(
      fakeAsync(() => {
        router.navigate(['/category', 'A.123.456', 'product', 'P1']);
        tick(5000);
      })
    );

    it(
      'should load the product and its required categories when going to a product page',
      fakeAsync(() => {
        expect(getCategoriesIds(store.state)).toEqual(['A', 'A.123', 'A.123.456', 'B']);
        expect(getProductIds(store.state)).toEqual(['P1']);
      })
    );

    it(
      'should trigger required load actions when going to a product page',
      fakeAsync(() => {
        const i = store.actionsIterator(['[Shopping]']);
        expect(i.next()).toEqual(new SelectCategory('A.123.456'));
        expect(i.next()).toEqual(new SelectProduct('P1'));
        expect(i.next()).toEqual(new LoadCategory('A'));
        expect(i.next()).toEqual(new LoadCategory('A.123'));
        expect(i.next()).toEqual(new LoadCategory('A.123.456'));
        expect(i.next().type).toEqual(RecentlyActionTypes.AddToRecently);
        expect(i.next()).toEqual(new LoadProduct('P1'));
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategories);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);
        expect(i.next().type).toEqual(ProductsActionTypes.LoadProductSuccess);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategoriesSuccess);
        expect(i.next()).toBeUndefined();
      })
    );

    describe('and changing the language', () => {
      beforeEach(
        fakeAsync(() => {
          store.reset();
          store.dispatch(new SelectLocale(locales[1]));
          tick(5000);
        })
      );

      it(
        'should reload the product and top level categries when language is changed',
        fakeAsync(() => {
          const i = store.actionsIterator(['[Shopping]']);
          expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategories);
          expect(i.next()).toEqual(new LoadProduct('P1'));
          expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategoriesSuccess);
          expect(i.next().type).toEqual(ProductsActionTypes.LoadProductSuccess);
          expect(i.next()).toBeUndefined();
        })
      );
    });

    describe('and and going back to the family page', () => {
      beforeEach(
        fakeAsync(() => {
          store.reset();
          router.navigate(['/category', 'A.123.456']);
          tick(5000);
        })
      );

      it(
        'should load the sibling products when they are not yet loaded',
        fakeAsync(() => {
          expect(getCategoriesIds(store.state)).toEqual(['A', 'A.123', 'A.123.456', 'B']);
          expect(getProductIds(store.state)).toEqual(['P1', 'P2']);
        })
      );

      it(
        'should trigger actions for products when they are not yet loaded',
        fakeAsync(() => {
          const i = store.actionsIterator(['[Shopping]']);
          expect(i.next()).toEqual(new SelectProduct(undefined));
          expect(i.next().type).toEqual(ProductsActionTypes.LoadProductsForCategory);
          expect(i.next().type).toEqual(CategoriesActionTypes.SetProductSkusForCategory);
          expect(i.next().type).toEqual(ViewconfActionTypes.SetSortKeys);
          expect(i.next()).toEqual(new LoadProduct('P2'));
          expect(i.next().type).toEqual(ProductsActionTypes.LoadProductSuccess);
          expect(i.next()).toBeUndefined();
        })
      );
    });
  });
});
