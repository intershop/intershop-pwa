// tslint:disable use-component-change-detection prefer-mocks-instead-of-stubs-in-tests
import { Component } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { combineReducers, StoreModule } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { RouteNavigation, ROUTER_NAVIGATION_TYPE } from 'ngrx-router';
import { EMPTY, of, throwError } from 'rxjs';
import { anyNumber, anyString, anything, instance, mock, when } from 'ts-mockito';
import {
  AVAILABLE_LOCALES,
  ENDLESS_SCROLLING_ITEMS_PER_PAGE,
  MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH,
} from '../../core/configurations/injection-keys';
import { CountryService } from '../../core/services/countries/country.service';
import { coreEffects, coreReducers } from '../../core/store/core.system';
import { SelectLocale } from '../../core/store/locale';
import { Category } from '../../models/category/category.model';
import { FilterNavigation } from '../../models/filter-navigation/filter-navigation.model';
import { Locale } from '../../models/locale/locale.model';
import { Product } from '../../models/product/product.model';
import { RegistrationService } from '../../registration/services/registration/registration.service';
import { LogEffects } from '../../utils/dev/log.effects';
import { categoryTree } from '../../utils/dev/test-data-utils';
import { CategoriesService } from '../services/categories/categories.service';
import { FilterService } from '../services/filter/filter.service';
import { ProductsService } from '../services/products/products.service';
import { SuggestService } from '../services/suggest/suggest.service';
import {
  CategoriesActionTypes,
  getCategoryIds,
  getSelectedCategory,
  LoadCategory,
  SelectCategory,
  SelectedCategoryAvailable,
} from './categories';
import { FilterActionTypes } from './filter';
import { getProductIds, getSelectedProduct, LoadProduct, ProductsActionTypes, SelectProduct } from './products';
import { getRecentlyProducts, RecentlyActionTypes } from './recently';
import { SearchActionTypes, SearchProducts, SuggestSearch, SuggestSearchSuccess } from './search';
import { shoppingEffects, shoppingReducers } from './shopping.system';
import { ViewconfActionTypes } from './viewconf';

describe('Shopping System', () => {
  const DEBUG = false;
  let store: LogEffects;
  let router: Router;
  let categoriesServiceMock: CategoriesService;
  let productsServiceMock: ProductsService;
  let suggestServiceMock: SuggestService;
  let filterServiceMock: FilterService;
  let locales: Locale[];

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    locales = [
      { lang: 'en_US', currency: 'USD', value: 'en' },
      { lang: 'de_DE', currency: 'EUR', value: 'de' },
      { lang: 'fr_FR', currency: 'EUR', value: 'fr' },
    ] as Locale[];

    const catA = { uniqueId: 'A', categoryPath: ['A'] } as Category;
    const catA123 = { uniqueId: 'A.123', categoryPath: ['A', 'A.123'] } as Category;
    const catA123456 = {
      uniqueId: 'A.123.456',
      categoryPath: ['A', 'A.123', 'A.123.456'],
      hasOnlineProducts: true,
    } as Category;
    const catB = { uniqueId: 'B', categoryPath: ['B'] } as Category;

    categoriesServiceMock = mock(CategoriesService);
    when(categoriesServiceMock.getTopLevelCategories(anyNumber())).thenReturn(
      of(categoryTree([catA, catA123, catB].map(c => ({ ...c, completenessLevel: 0 }))))
    );
    when(categoriesServiceMock.getCategory(anything())).thenCall(uniqueId => {
      switch (uniqueId) {
        case 'A':
          return of(categoryTree([{ ...catA, completenessLevel: 2 }, { ...catA123, completenessLevel: 1 }]));
        case 'B':
          return of(categoryTree([{ ...catB, completenessLevel: 2 }]));
        case 'A.123':
          return of(categoryTree([{ ...catA123, completenessLevel: 2 }, { ...catA123456, completenessLevel: 1 }]));
        case 'A.123.456':
          return of(categoryTree([{ ...catA123456, completenessLevel: 2 }]));
        default:
          return throwError({ message: `error loading category ${uniqueId}` });
      }
    });

    const countryServiceMock = mock(CountryService);
    when(countryServiceMock.getCountries()).thenReturn(EMPTY);

    productsServiceMock = mock(ProductsService);
    when(productsServiceMock.getProduct(anyString())).thenCall(sku => {
      if (['P1', 'P2'].find(x => x === sku)) {
        return of({ sku });
      } else {
        return throwError({ message: `error loading product ${sku}` });
      }
    });
    when(productsServiceMock.getCategoryProducts('A.123.456', anyNumber(), anyNumber(), anyString())).thenReturn(
      of({
        categoryUniqueId: 'A.123.456',
        sortKeys: [],
        products: [{ sku: 'P1' }, { sku: 'P2' }] as Product[],
        total: 2,
      })
    );
    when(productsServiceMock.searchProducts('something', anyNumber(), anyNumber())).thenReturn(
      of({ products: [{ sku: 'P2' } as Product], sortKeys: [], total: 1 })
    );

    suggestServiceMock = mock(SuggestService);
    when(suggestServiceMock.search('some')).thenReturn(of([{ term: 'something' }]));

    filterServiceMock = mock(FilterService);
    when(filterServiceMock.getFilterForSearch(anything())).thenReturn(of({} as FilterNavigation));
    when(filterServiceMock.getFilterForCategory(anything())).thenReturn(of({} as FilterNavigation));
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
            path: 'compare',
            component: DummyComponent,
          },
          {
            path: 'error',
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
          {
            path: 'product/:sku',
            component: DummyComponent,
          },
          {
            path: 'search/:searchTerm',
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
        { provide: SuggestService, useFactory: () => instance(suggestServiceMock) },
        { provide: FilterService, useFactory: () => instance(filterServiceMock) },
        { provide: MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH, useValue: 1 },
        { provide: AVAILABLE_LOCALES, useValue: locales },
        { provide: ENDLESS_SCROLLING_ITEMS_PER_PAGE, useValue: 3 },
      ],
    });

    store = TestBed.get(LogEffects);
    store.logActions = DEBUG;
    store.logState = DEBUG;
    router = TestBed.get(Router);
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

        expect(getCategoryIds(store.state)).toBeArrayOfSize(3);
        expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'B']);
        expect(getProductIds(store.state)).toBeEmpty();
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

    describe('and going to a category page', () => {
      beforeEach(
        fakeAsync(() => {
          store.reset();
          router.navigate(['/category', 'A.123']);
          tick(5000);
        })
      );

      it(
        'should load necessary data when going to a category page',
        fakeAsync(() => {
          expect(getCategoryIds(store.state)).toBeArrayOfSize(4);
          expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'A.123.456', 'B']);
          expect(getProductIds(store.state)).toBeEmpty();
        })
      );

      it(
        'should have toplevel loading and category loading actions when going to a category page',
        fakeAsync(() => {
          const i = store.actionsIterator(['[Shopping]']);
          expect(i.next()).toEqual(new SelectCategory('A.123'));
          expect(i.next().type).toEqual(FilterActionTypes.LoadFilterForCategory);
          expect(i.next()).toEqual(new LoadCategory('A.123'));
          expect(i.next().type).toEqual(FilterActionTypes.LoadFilterForCategorySuccess);
          expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);
          expect(i.next()).toEqual(new SelectedCategoryAvailable('A.123'));
          expect(i.next()).toEqual(new LoadCategory('A'));
          expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);
          expect(i.next()).toBeUndefined();
        })
      );
    });

    describe('and looking for suggestions', () => {
      beforeEach(
        fakeAsync(() => {
          store.reset();
          store.dispatch(new SuggestSearch('some'));
          tick(5000);
        })
      );

      it('should trigger suggest actions when suggest feature is used', () => {
        const i = store.actionsIterator([/Shopping/]);

        expect(i.next()).toEqual(new SuggestSearchSuccess([{ term: 'something' }]));
        expect(i.next()).toBeUndefined();
      });
    });

    describe('and searching for something', () => {
      beforeEach(
        fakeAsync(() => {
          store.reset();
          router.navigate(['/search', 'something']);
          tick(5000);
        })
      );

      it(
        'should load the product for the search results',
        fakeAsync(() => {
          expect(getProductIds(store.state)).toEqual(['P2']);
        })
      );

      it(
        'should trigger required actions when searching',
        fakeAsync(() => {
          const i = store.actionsIterator([/Shopping/]);

          expect(i.next()).toEqual(new SearchProducts('something'));
          expect(i.next().type).toEqual(SearchActionTypes.SearchProductsSuccess);
          expect(i.next().type).toEqual(ViewconfActionTypes.SetPagingInfo);
          expect(i.next().type).toEqual(ProductsActionTypes.LoadProductSuccess);
          expect(i.next().type).toEqual(ViewconfActionTypes.SetSortKeys);
          expect(i.next().type).toEqual(FilterActionTypes.LoadFilterForSearch);
          expect(i.next().type).toEqual(FilterActionTypes.LoadFilterForSearchSuccess);
          expect(i.next()).toBeUndefined();
        })
      );

      describe('and viewing the product', () => {
        beforeEach(
          fakeAsync(() => {
            store.reset();
            router.navigate(['/product', 'P2']);
            tick(5000);
          })
        );

        it(
          'should reload the product data when selected',
          fakeAsync(() => {
            const i = store.actionsIterator([/Shopping/]);

            expect(i.next()).toEqual(new SelectProduct('P2'));
            expect(i.next().type).toEqual(RecentlyActionTypes.AddToRecently);
            expect(i.next()).toEqual(new LoadProduct('P2'));
            expect(i.next().type).toEqual(ProductsActionTypes.LoadProductSuccess);
            expect(i.next()).toBeUndefined();
          })
        );
      });
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
        expect(getCategoryIds(store.state)).toBeArrayOfSize(4);
        expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'A.123.456', 'B']);
        expect(getProductIds(store.state)).toBeEmpty();
      })
    );

    it(
      'should have toplevel loading and category loading actions when going to a category page',
      fakeAsync(() => {
        const i = store.actionsIterator(['[Shopping]', '[Router]']);
        expect(i.next().type).toEqual(ROUTER_NAVIGATION_TYPE);
        expect(i.next()).toEqual(new SelectCategory('A.123'));
        expect(i.next()).toEqual(new LoadCategory('A.123'));
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategories);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategoriesSuccess);
        expect(i.next()).toEqual(new SelectedCategoryAvailable('A.123'));
        expect(i.next().type).toEqual(FilterActionTypes.LoadFilterForCategory);
        expect(i.next()).toEqual(new LoadCategory('A'));
        expect(i.next().type).toEqual(FilterActionTypes.LoadFilterForCategorySuccess);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);

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

    describe('and and going to compare page', () => {
      beforeEach(
        fakeAsync(() => {
          store.reset();
          router.navigate(['/compare']);
          tick(5000);
        })
      );

      it(
        'should not load anything additionally when going to compare page',
        fakeAsync(() => {
          expect(getCategoryIds(store.state)).toBeArrayOfSize(4);
          expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'A.123.456', 'B']);
          expect(getProductIds(store.state)).toBeEmpty();
        })
      );

      it(
        'should trigger actions for deselecting category and product when no longer in category or product',
        fakeAsync(() => {
          const i = store.actionsIterator(['[Shopping]']);
          expect(i.next().type).toEqual(CategoriesActionTypes.DeselectCategory);
          expect(i.next()).toBeUndefined();
        })
      );

      it(
        'should not have a selected product or category when redirected to error page',
        fakeAsync(() => {
          expect(getSelectedCategory(store.state)).toBeUndefined();
          expect(getSelectedProduct(store.state)).toBeUndefined();
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
        expect(getCategoryIds(store.state)).toBeArrayOfSize(4);
        expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'A.123.456', 'B']);
        expect(getProductIds(store.state)).toEqual(['P1', 'P2']);
      })
    );

    it(
      'should have all required actions when going to a family page',
      fakeAsync(() => {
        const i = store.actionsIterator(['[Shopping]']);
        expect(i.next()).toEqual(new SelectCategory('A.123.456'));
        expect(i.next()).toEqual(new LoadCategory('A.123.456'));
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategories);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategoriesSuccess);
        expect(i.next()).toEqual(new SelectedCategoryAvailable('A.123.456'));
        expect(i.next().type).toEqual(FilterActionTypes.LoadFilterForCategory);
        expect(i.next()).toEqual(new LoadCategory('A'));
        expect(i.next()).toEqual(new LoadCategory('A.123'));
        expect(i.next().type).toEqual(ProductsActionTypes.LoadProductsForCategory);
        expect(i.next().type).toEqual(FilterActionTypes.LoadFilterForCategorySuccess);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);
        expect(i.next().type).toEqual(CategoriesActionTypes.SetProductSkusForCategory);
        expect(i.next().type).toEqual(ViewconfActionTypes.SetPagingInfo);
        expect(i.next().type).toEqual(ViewconfActionTypes.SetSortKeys);
        expect(i.next().type).toEqual(ProductsActionTypes.LoadProductSuccess);
        expect(i.next().type).toEqual(ProductsActionTypes.LoadProductSuccess);
        expect(i.next()).toBeUndefined();
      })
    );

    it(
      'should not put anything in recently viewed products when going to a family page',
      fakeAsync(() => {
        expect(getRecentlyProducts(store.state)).toBeEmpty();
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

      it(
        'should add the product to recently viewed products when going to product detail page',
        fakeAsync(() => {
          expect(getRecentlyProducts(store.state)).toEqual(['P1']);
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

      it(
        'should not put anything additionally in recently viewed products when changing the language',
        fakeAsync(() => {
          expect(getRecentlyProducts(store.state)).toBeEmpty();
        })
      );
    });

    describe('and and going to compare page', () => {
      beforeEach(
        fakeAsync(() => {
          store.reset();
          router.navigate(['/compare']);
          tick(5000);
        })
      );

      it(
        'should not load anything additionally when going to compare page',
        fakeAsync(() => {
          expect(getCategoryIds(store.state)).toBeArrayOfSize(4);
          expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'A.123.456', 'B']);
          expect(getProductIds(store.state)).toEqual(['P1', 'P2']);
        })
      );

      it(
        'should trigger actions for deselecting category and product when no longer in category or product',
        fakeAsync(() => {
          const i = store.actionsIterator(['[Shopping]']);
          expect(i.next().type).toEqual(CategoriesActionTypes.DeselectCategory);
          expect(i.next()).toBeUndefined();
        })
      );

      it(
        'should not have a selected product or category when redirected to error page',
        fakeAsync(() => {
          expect(getSelectedCategory(store.state)).toBeUndefined();
          expect(getSelectedProduct(store.state)).toBeUndefined();
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
        expect(getCategoryIds(store.state)).toBeArrayOfSize(4);
        expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'A.123.456', 'B']);
        expect(getProductIds(store.state)).toEqual(['P1']);
      })
    );

    it(
      'should trigger required load actions when going to a product page',
      fakeAsync(() => {
        const i = store.actionsIterator(['[Shopping]']);
        expect(i.next()).toEqual(new SelectCategory('A.123.456'));
        expect(i.next()).toEqual(new SelectProduct('P1'));
        expect(i.next()).toEqual(new LoadCategory('A.123.456'));
        expect(i.next()).toEqual(new LoadProduct('P1'));
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategories);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);
        expect(i.next().type).toEqual(ProductsActionTypes.LoadProductSuccess);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategoriesSuccess);
        expect(i.next()).toEqual(new SelectedCategoryAvailable('A.123.456'));
        expect(i.next().type).toEqual(FilterActionTypes.LoadFilterForCategory);
        expect(i.next().type).toEqual(RecentlyActionTypes.AddToRecently);
        expect(i.next()).toEqual(new LoadCategory('A'));
        expect(i.next()).toEqual(new LoadCategory('A.123'));
        expect(i.next().type).toEqual(FilterActionTypes.LoadFilterForCategorySuccess);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);
        expect(i.next()).toBeUndefined();
      })
    );

    it(
      'should put the product to recently viewed products when going to product detail page',
      fakeAsync(() => {
        expect(getRecentlyProducts(store.state)).toEqual(['P1']);
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

      it(
        'should not put anything additionally to recently viewed products when changing the language',
        fakeAsync(() => {
          expect(getRecentlyProducts(store.state)).toEqual(['P1']);
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
          expect(getCategoryIds(store.state)).toBeArrayOfSize(4);
          expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'A.123.456', 'B']);
          expect(getProductIds(store.state)).toEqual(['P1', 'P2']);
        })
      );

      it(
        'should trigger actions for products when they are not yet loaded',
        fakeAsync(() => {
          const i = store.actionsIterator(['[Shopping]']);
          expect(i.next().type).toEqual(ProductsActionTypes.LoadProductsForCategory);
          expect(i.next()).toEqual(new SelectProduct(undefined));
          expect(i.next().type).toEqual(CategoriesActionTypes.SetProductSkusForCategory);
          expect(i.next().type).toEqual(ViewconfActionTypes.SetPagingInfo);
          expect(i.next().type).toEqual(ViewconfActionTypes.SetSortKeys);
          expect(i.next().type).toEqual(ProductsActionTypes.LoadProductSuccess);
          expect(i.next()).toBeUndefined();
        })
      );

      it(
        'should not put anything additionally to recently viewed products when going back',
        fakeAsync(() => {
          expect(getRecentlyProducts(store.state)).toEqual(['P1']);
        })
      );
    });

    describe('and and going to compare page', () => {
      beforeEach(
        fakeAsync(() => {
          store.reset();
          router.navigate(['/compare']);
          tick(5000);
        })
      );

      it(
        'should not load anything additionally when going to compare page',
        fakeAsync(() => {
          expect(getCategoryIds(store.state)).toBeArrayOfSize(4);
          expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'A.123.456', 'B']);
          expect(getProductIds(store.state)).toEqual(['P1']);
        })
      );

      it(
        'should trigger actions for deselecting category and product when no longer in category or product',
        fakeAsync(() => {
          const i = store.actionsIterator(['[Shopping]']);
          expect(i.next().type).toEqual(CategoriesActionTypes.DeselectCategory);
          expect(i.next()).toEqual(new SelectProduct(undefined));
          expect(i.next()).toBeUndefined();
        })
      );

      it(
        'should not have a selected product or category when redirected to error page',
        fakeAsync(() => {
          expect(getSelectedCategory(store.state)).toBeUndefined();
          expect(getSelectedProduct(store.state)).toBeUndefined();
        })
      );
    });
  });

  describe('product page without category context', () => {
    beforeEach(
      fakeAsync(() => {
        router.navigate(['/product', 'P1']);
        tick(5000);
      })
    );

    it(
      'should load the product ang top level categories when going to a product page',
      fakeAsync(() => {
        expect(getCategoryIds(store.state)).toBeArrayOfSize(3);
        expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'B']);
        expect(getProductIds(store.state)).toEqual(['P1']);
      })
    );

    it(
      'should trigger required load actions when going to a product page',
      fakeAsync(() => {
        const i = store.actionsIterator(['[Shopping]']);
        expect(i.next()).toEqual(new SelectProduct('P1'));
        expect(i.next()).toEqual(new LoadProduct('P1'));
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategories);
        expect(i.next().type).toEqual(ProductsActionTypes.LoadProductSuccess);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategoriesSuccess);
        expect(i.next().type).toEqual(RecentlyActionTypes.AddToRecently);
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

    describe('and and going to compare page', () => {
      beforeEach(
        fakeAsync(() => {
          store.reset();
          router.navigate(['/compare']);
          tick(5000);
        })
      );

      it(
        'should not load anything additionally when going to compare page',
        fakeAsync(() => {
          expect(getCategoryIds(store.state)).toBeArrayOfSize(3);
          expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'B']);
          expect(getProductIds(store.state)).toEqual(['P1']);
        })
      );

      it(
        'should trigger actions for deselecting category and product when no longer in category or product',
        fakeAsync(() => {
          const i = store.actionsIterator(['[Shopping]']);
          expect(i.next()).toEqual(new SelectProduct(undefined));
          expect(i.next()).toBeUndefined();
        })
      );

      it(
        'should not have a selected product or category when redirected to error page',
        fakeAsync(() => {
          expect(getSelectedCategory(store.state)).toBeUndefined();
          expect(getSelectedProduct(store.state)).toBeUndefined();
        })
      );
    });
  });

  describe('product page with invalid product', () => {
    beforeEach(
      fakeAsync(() => {
        router.navigate(['/category', 'A.123.456', 'product', 'P3']);
        tick(5000);
      })
    );

    it(
      'should load only family page content and redirect to error when product was not found',
      fakeAsync(() => {
        expect(getCategoryIds(store.state)).toBeArrayOfSize(4);
        expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'A.123.456', 'B']);
        expect(getProductIds(store.state)).toBeEmpty();
      })
    );

    it(
      'should trigger required load actions when going to a product page with invalid product sku',
      fakeAsync(() => {
        const i = store.actionsIterator(['[Shopping]', '[Router]']);

        const productPageRouting = i.next() as RouteNavigation;
        expect(productPageRouting.type).toEqual(ROUTER_NAVIGATION_TYPE);
        expect(productPageRouting.payload.params.sku).toEqual('P3');
        expect(productPageRouting.payload.params.categoryUniqueId).toEqual('A.123.456');

        expect(i.next()).toEqual(new SelectCategory('A.123.456'));
        expect(i.next()).toEqual(new SelectProduct('P3'));
        expect(i.next()).toEqual(new LoadCategory('A.123.456'));
        expect(i.next()).toEqual(new LoadProduct('P3'));
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategories);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);
        expect(i.next().type).toEqual(ProductsActionTypes.LoadProductFail);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategoriesSuccess);
        expect(i.next()).toEqual(new SelectedCategoryAvailable('A.123.456'));
        expect(i.next().type).toEqual(FilterActionTypes.LoadFilterForCategory);
        expect(i.next()).toEqual(new LoadCategory('A'));
        expect(i.next()).toEqual(new LoadCategory('A.123'));
        expect(i.next().type).toEqual(FilterActionTypes.LoadFilterForCategorySuccess);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);

        const errorPageRouting = i.next() as RouteNavigation;
        expect(errorPageRouting.type).toEqual(ROUTER_NAVIGATION_TYPE);
        expect(errorPageRouting.payload.path).toEqual('error');

        expect(i.next().type).toEqual(CategoriesActionTypes.DeselectCategory);
        expect(i.next()).toEqual(new SelectProduct(undefined));
        expect(i.next()).toBeUndefined();
      })
    );

    it(
      'should not have a selected product or category when redirected to error page',
      fakeAsync(() => {
        expect(getSelectedCategory(store.state)).toBeUndefined();
        expect(getSelectedProduct(store.state)).toBeUndefined();
      })
    );

    it(
      'should not put anything to recently viewed products when invalid product was selected',
      fakeAsync(() => {
        expect(getRecentlyProducts(store.state)).toBeEmpty();
      })
    );
  });

  describe('category page with invalid category', () => {
    beforeEach(
      fakeAsync(() => {
        router.navigate(['/category', 'A.123.XXX']);
        tick(5000);
      })
    );

    it(
      'should load only some categories and redirect to error when category was not found',
      fakeAsync(() => {
        expect(getCategoryIds(store.state)).toBeArrayOfSize(3);
        expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'B']);
        expect(getProductIds(store.state)).toBeEmpty();
      })
    );

    it(
      'should trigger required load actions when going to a category page with invalid category uniqueId',
      fakeAsync(() => {
        const i = store.actionsIterator(['[Shopping]', '[Router]']);

        const productPageRouting = i.next() as RouteNavigation;
        expect(productPageRouting.type).toEqual(ROUTER_NAVIGATION_TYPE);
        expect(productPageRouting.payload.params.categoryUniqueId).toEqual('A.123.XXX');

        expect(i.next()).toEqual(new SelectCategory('A.123.XXX'));
        expect(i.next()).toEqual(new LoadCategory('A.123.XXX'));
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategories);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategoryFail);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategoriesSuccess);

        const errorPageRouting = i.next() as RouteNavigation;
        expect(errorPageRouting.type).toEqual(ROUTER_NAVIGATION_TYPE);
        expect(errorPageRouting.payload.path).toEqual('error');

        expect(i.next().type).toEqual(CategoriesActionTypes.DeselectCategory);
        expect(i.next()).toBeUndefined();
      })
    );

    it(
      'should not have a selected product or category when redirected to error page',
      fakeAsync(() => {
        expect(getSelectedCategory(store.state)).toBeUndefined();
        expect(getSelectedProduct(store.state)).toBeUndefined();
      })
    );
  });

  describe('searching for something', () => {
    beforeEach(
      fakeAsync(() => {
        router.navigate(['/search', 'something']);
        tick(5000);
      })
    );

    it(
      'should load the product for the search results',
      fakeAsync(() => {
        expect(getProductIds(store.state)).toEqual(['P2']);
      })
    );

    it(
      'should trigger required actions when searching',
      fakeAsync(() => {
        const i = store.actionsIterator(['[Shopping]']);

        expect(i.next()).toEqual(new SearchProducts('something'));
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategories);
        expect(i.next().type).toEqual(SearchActionTypes.SearchProductsSuccess);
        expect(i.next().type).toEqual(ViewconfActionTypes.SetPagingInfo);
        expect(i.next().type).toEqual(ProductsActionTypes.LoadProductSuccess);
        expect(i.next().type).toEqual(ViewconfActionTypes.SetSortKeys);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategoriesSuccess);
        expect(i.next().type).toEqual(FilterActionTypes.LoadFilterForSearch);
        expect(i.next().type).toEqual(FilterActionTypes.LoadFilterForSearchSuccess);
        expect(i.next()).toBeUndefined();
      })
    );
  });
});
