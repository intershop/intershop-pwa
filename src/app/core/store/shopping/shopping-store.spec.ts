import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { EMPTY, of, throwError } from 'rxjs';
import { anyNumber, anyString, anything, instance, mock, when } from 'ts-mockito';

import {
  AVAILABLE_LOCALES,
  DEFAULT_PRODUCT_LISTING_VIEW_TYPE,
  LARGE_BREAKPOINT_WIDTH,
  MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH,
  MEDIUM_BREAKPOINT_WIDTH,
  PRODUCT_LISTING_ITEMS_PER_PAGE,
} from 'ish-core/configurations/injection-keys';
import { Category, CategoryCompletenessLevel } from 'ish-core/models/category/category.model';
import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { Locale } from 'ish-core/models/locale/locale.model';
import { Product } from 'ish-core/models/product/product.model';
import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { AddressService } from 'ish-core/services/address/address.service';
import { CategoriesService } from 'ish-core/services/categories/categories.service';
import { ConfigurationService } from 'ish-core/services/configuration/configuration.service';
import { CountryService } from 'ish-core/services/country/country.service';
import { FilterService } from 'ish-core/services/filter/filter.service';
import { OrderService } from 'ish-core/services/order/order.service';
import { PaymentService } from 'ish-core/services/payment/payment.service';
import { PersonalizationService } from 'ish-core/services/personalization/personalization.service';
import { ProductsService } from 'ish-core/services/products/products.service';
import { PromotionsService } from 'ish-core/services/promotions/promotions.service';
import { SuggestService } from 'ish-core/services/suggest/suggest.service';
import { UserService } from 'ish-core/services/user/user.service';
import { coreEffects, coreReducers } from 'ish-core/store/core-store.module';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import { getCategoryIds, getSelectedCategory } from './categories';
import { getProductIds, getSelectedProduct } from './products';
import { getRecentlyViewedProducts } from './recently';
import { SuggestSearchAPI } from './search';
import { shoppingEffects, shoppingReducers } from './shopping-store.module';

describe('Shopping Store', () => {
  const DEBUG = false;
  let store: TestStore;
  let router: Router;
  let categoriesServiceMock: CategoriesService;
  let productsServiceMock: ProductsService;
  let promotionsServiceMock: PromotionsService;
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

    const promotion = {
      id: 'PROMO_UUID',
      name: 'MyPromotion',
      couponCodeRequired: false,
      currency: 'EUR',
      promotionType: 'MyPromotionType',
      description: 'MyPromotionDescription',
      legalContentMessage: 'MyPromotionContentMessage',
      longTitle: 'MyPromotionLongTitle',
      ruleDescription: 'MyPromotionRuleDescription',
      title: 'MyPromotionTitle',
      useExternalUrl: false,
    } as Promotion;

    categoriesServiceMock = mock(CategoriesService);
    when(categoriesServiceMock.getTopLevelCategories(anyNumber())).thenReturn(
      of(categoryTree([catA, catA123, catB].map(c => ({ ...c, completenessLevel: 0 }))))
    );
    when(categoriesServiceMock.getCategory(anything())).thenCall(uniqueId => {
      switch (uniqueId) {
        case 'A':
          return of(
            categoryTree([
              { ...catA, completenessLevel: CategoryCompletenessLevel.Max },
              { ...catA123, completenessLevel: 1 },
            ])
          );
        case 'B':
          return of(categoryTree([{ ...catB, completenessLevel: CategoryCompletenessLevel.Max }]));
        case 'A.123':
          return of(
            categoryTree([
              { ...catA123, completenessLevel: CategoryCompletenessLevel.Max },
              { ...catA123456, completenessLevel: 1 },
            ])
          );
        case 'A.123.456':
          return of(categoryTree([{ ...catA123456, completenessLevel: CategoryCompletenessLevel.Max }]));
        default:
          return throwError({ message: `error loading category ${uniqueId}` });
      }
    });

    const configurationServiceMock = mock(ConfigurationService);
    when(configurationServiceMock.getServerConfiguration()).thenReturn(EMPTY);

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
    when(productsServiceMock.getCategoryProducts('A.123.456', anyNumber(), anything())).thenReturn(
      of({
        sortKeys: [],
        products: [{ sku: 'P1' }, { sku: 'P2' }] as Product[],
        total: 2,
      })
    );
    when(productsServiceMock.searchProducts('something', anyNumber(), anything())).thenReturn(
      of({ products: [{ sku: 'P2' } as Product], sortKeys: [], total: 1 })
    );

    promotionsServiceMock = mock(PromotionsService);
    when(promotionsServiceMock.getPromotion(anything())).thenReturn(of(promotion));

    suggestServiceMock = mock(SuggestService);
    when(suggestServiceMock.search('some')).thenReturn(of([{ term: 'something' }]));

    filterServiceMock = mock(FilterService);
    when(filterServiceMock.getFilterForSearch(anything())).thenReturn(of({} as FilterNavigation));
    when(filterServiceMock.getFilterForCategory(anything())).thenReturn(of({} as FilterNavigation));

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
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
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
        ngrxTesting({
          reducers: {
            ...coreReducers,
            shopping: combineReducers(shoppingReducers),
          },
          effects: [...coreEffects, ...shoppingEffects],
          routerStore: true,
        }),
      ],
      providers: [
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
        { provide: ConfigurationService, useFactory: () => instance(configurationServiceMock) },
        { provide: CountryService, useFactory: () => instance(countryServiceMock) },
        { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
        { provide: PromotionsService, useFactory: () => instance(promotionsServiceMock) },
        { provide: OrderService, useFactory: () => instance(mock(OrderService)) },
        { provide: UserService, useFactory: () => instance(mock(UserService)) },
        { provide: PaymentService, useFactory: () => instance(mock(PaymentService)) },
        { provide: PersonalizationService, useFactory: () => instance(mock(PersonalizationService)) },
        { provide: AddressService, useFactory: () => instance(mock(AddressService)) },
        { provide: SuggestService, useFactory: () => instance(suggestServiceMock) },
        { provide: FilterService, useFactory: () => instance(filterServiceMock) },
        { provide: MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH, useValue: 1 },
        { provide: AVAILABLE_LOCALES, useValue: locales },
        { provide: PRODUCT_LISTING_ITEMS_PER_PAGE, useValue: 3 },
        { provide: MEDIUM_BREAKPOINT_WIDTH, useValue: 768 },
        { provide: LARGE_BREAKPOINT_WIDTH, useValue: 992 },
        { provide: DEFAULT_PRODUCT_LISTING_VIEW_TYPE, useValue: 'list' },
      ],
    });

    store = TestBed.get(TestStore);
    store.logActions = DEBUG;
    store.logState = DEBUG;
    router = TestBed.get(Router);
    store.reset();
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('home page', () => {
    beforeEach(fakeAsync(() => {
      router.navigate(['/home']);
      tick(5000);
    }));

    it('should just load toplevel categories when no specific shopping page is loaded', fakeAsync(() => {
      expect(store.actionsArray()).toMatchInlineSnapshot(`
        @ngrx/router-store/request:
          routerState: {"url":"","params":{},"queryParams":{},"data":{}}
          event: {"id":1,"url":"/home"}
        @ngrx/router-store/navigation:
          routerState: {"url":"/home","params":{},"queryParams":{},"data":{}}
          event: {"id":1,"url":"/home"}
        [Configuration Internal] Get the ICM configuration
        @ngrx/router-store/navigated:
          routerState: {"url":"/home","params":{},"queryParams":{},"data":{}}
          event: {"id":1,"url":"/home"}
        [Shopping] Load top level categories:
          depth: 1
        [Shopping] Load top level categories success:
          categories: tree(A,A.123,B)
      `);

      expect(getCategoryIds(store.state)).toBeArrayOfSize(3);
      expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'B']);
      expect(getProductIds(store.state)).toBeEmpty();
    }));

    describe('and going to a category page', () => {
      beforeEach(fakeAsync(() => {
        store.reset();
        router.navigate(['/category', 'A.123']);
        tick(5000);
      }));

      it('should load necessary data when going to a category page', fakeAsync(() => {
        expect(getCategoryIds(store.state)).toBeArrayOfSize(4);
        expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'A.123.456', 'B']);
        expect(getProductIds(store.state)).toBeEmpty();
      }));

      it('should have toplevel loading and category loading actions when going to a category page', fakeAsync(() => {
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          @ngrx/router-store/request:
            routerState: {"url":"/home","params":{},"queryParams":{},"data":{}}
            event: {"id":2,"url":"/category/A.123"}
          @ngrx/router-store/navigation:
            routerState: {"url":"/category/A.123","params":{"categoryUniqueId":"A.123...
            event: {"id":2,"url":"/category/A.123"}
          [Shopping] Select Category:
            categoryId: "A.123"
          [Configuration Internal] Get the ICM configuration
          [Shopping] Load Category:
            categoryId: "A.123"
          [Shopping] Load Category Success:
            categories: tree(A.123,A.123.456)
          [Shopping] Selected Category Available:
            categoryId: "A.123"
          [Shopping] Load Category:
            categoryId: "A"
          [Shopping] Load Category Success:
            categories: tree(A,A.123)
          @ngrx/router-store/navigated:
            routerState: {"url":"/category/A.123","params":{"categoryUniqueId":"A.123...
            event: {"id":2,"url":"/category/A.123"}
        `);
      }));
    });

    describe('and looking for suggestions', () => {
      beforeEach(fakeAsync(() => {
        store.reset();
        store.dispatch(new SuggestSearchAPI({ searchTerm: 'some' }));
        tick(5000);
      }));

      it('should trigger suggest actions when suggest feature is used', () => {
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          [Suggest Search Internal] Trigger API Call for Search Suggestions:
            searchTerm: "some"
          [Suggest Search Internal] Return Search Suggestions:
            searchTerm: "some"
            suggests: [{"term":"something"}]
        `);
      });
    });

    describe('and searching for something', () => {
      beforeEach(fakeAsync(() => {
        store.reset();
        router.navigate(['/search', 'something']);
        tick(5000);
      }));

      it('should load the product for the search results', fakeAsync(() => {
        expect(getProductIds(store.state)).toEqual(['P2']);
      }));

      it('should trigger required actions when searching', fakeAsync(() => {
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          @ngrx/router-store/request:
            routerState: {"url":"/home","params":{},"queryParams":{},"data":{}}
            event: {"id":2,"url":"/search/something"}
          @ngrx/router-store/navigation:
            routerState: {"url":"/search/something","params":{"searchTerm":"something...
            event: {"id":2,"url":"/search/something"}
          [Shopping] Set Search Term:
            searchTerm: "something"
          [Configuration Internal] Get the ICM configuration
          [ProductListing] Load More Products:
            id: {"type":"search","value":"something"}
          [ProductListing Internal] Load More Products For Params:
            id: {"type":"search","value":"something"}
            filters: undefined
            sorting: undefined
            page: undefined
          [Shopping] Search Products:
            searchTerm: "something"
            page: undefined
            sorting: undefined
          [Shopping] Load Filter for Search:
            searchTerm: "something"
          [Shopping] Load Product Success:
            product: {"sku":"P2"}
          [ProductListing] Set Product Listing Pages:
            1: ["P2"]
            id: {"type":"search","value":"something"}
            itemCount: 1
            sortKeys: []
          [Shopping] Load Filter Success:
            filterNavigation: {}
          [ProductListing] Set Product Listing Pages:
            id: {"type":"search","value":"something"}
          @ngrx/router-store/navigated:
            routerState: {"url":"/search/something","params":{"searchTerm":"something...
            event: {"id":2,"url":"/search/something"}
        `);
      }));

      describe('and viewing the product', () => {
        beforeEach(fakeAsync(() => {
          store.reset();
          router.navigate(['/product', 'P2']);
          tick(5000);
        }));

        it('should reload the product data when selected', fakeAsync(() => {
          expect(store.actionsArray()).toMatchInlineSnapshot(`
            @ngrx/router-store/request:
              routerState: {"url":"/search/something","params":{"searchTerm":"something...
              event: {"id":3,"url":"/product/P2"}
            @ngrx/router-store/navigation:
              routerState: {"url":"/product/P2","params":{"sku":"P2"},"queryParams":{},...
              event: {"id":3,"url":"/product/P2"}
            [Shopping] Select Product:
              sku: "P2"
            [Configuration Internal] Get the ICM configuration
            [Recently Viewed] Add Product to Recently:
              sku: "P2"
              group: undefined
            [Shopping] Load Product:
              sku: "P2"
            [Shopping] Load Product Success:
              product: {"sku":"P2"}
            @ngrx/router-store/navigated:
              routerState: {"url":"/product/P2","params":{"sku":"P2"},"queryParams":{},...
              event: {"id":3,"url":"/product/P2"}
          `);
        }));
      });
    });
  });

  describe('category page', () => {
    beforeEach(fakeAsync(() => {
      router.navigate(['/category', 'A.123']);
      tick(5000);
    }));

    it('should load necessary data when going to a category page', fakeAsync(() => {
      expect(getCategoryIds(store.state)).toBeArrayOfSize(4);
      expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'A.123.456', 'B']);
      expect(getProductIds(store.state)).toBeEmpty();
    }));

    it('should have toplevel loading and category loading actions when going to a category page', fakeAsync(() => {
      expect(store.actionsArray()).toMatchInlineSnapshot(`
        @ngrx/router-store/request:
          routerState: {"url":"","params":{},"queryParams":{},"data":{}}
          event: {"id":1,"url":"/category/A.123"}
        @ngrx/router-store/navigation:
          routerState: {"url":"/category/A.123","params":{"categoryUniqueId":"A.123...
          event: {"id":1,"url":"/category/A.123"}
        [Shopping] Select Category:
          categoryId: "A.123"
        [Configuration Internal] Get the ICM configuration
        [Shopping] Load Category:
          categoryId: "A.123"
        [Shopping] Load Category Success:
          categories: tree(A.123,A.123.456)
        [Shopping] Selected Category Available:
          categoryId: "A.123"
        [Shopping] Load Category:
          categoryId: "A"
        [Shopping] Load Category Success:
          categories: tree(A,A.123)
        @ngrx/router-store/navigated:
          routerState: {"url":"/category/A.123","params":{"categoryUniqueId":"A.123...
          event: {"id":1,"url":"/category/A.123"}
        [Shopping] Load top level categories:
          depth: 1
        [Shopping] Load top level categories success:
          categories: tree(A,A.123,B)
      `);
    }));

    describe('and and going to compare page', () => {
      beforeEach(fakeAsync(() => {
        store.reset();
        router.navigate(['/compare']);
        tick(5000);
      }));

      it('should not load anything additionally when going to compare page', fakeAsync(() => {
        expect(getCategoryIds(store.state)).toBeArrayOfSize(4);
        expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'A.123.456', 'B']);
        expect(getProductIds(store.state)).toBeEmpty();
      }));

      it('should trigger actions for deselecting category and product when no longer in category or product', fakeAsync(() => {
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          @ngrx/router-store/request:
            routerState: {"url":"/category/A.123","params":{"categoryUniqueId":"A.123...
            event: {"id":2,"url":"/compare"}
          @ngrx/router-store/navigation:
            routerState: {"url":"/compare","params":{},"queryParams":{},"data":{}}
            event: {"id":2,"url":"/compare"}
          [Shopping] Deselect Category
          [Configuration Internal] Get the ICM configuration
          @ngrx/router-store/navigated:
            routerState: {"url":"/compare","params":{},"queryParams":{},"data":{}}
            event: {"id":2,"url":"/compare"}
        `);
      }));

      it('should not have a selected product or category when redirected to error page', fakeAsync(() => {
        expect(getSelectedCategory(store.state)).toBeUndefined();
        expect(getSelectedProduct(store.state)).toBeUndefined();
      }));
    });
  });

  describe('family page', () => {
    beforeEach(fakeAsync(() => {
      router.navigate(['/category', 'A.123.456']);
      tick(5000);
    }));

    it('should load all products and required categories when going to a family page', fakeAsync(() => {
      expect(getCategoryIds(store.state)).toBeArrayOfSize(4);
      expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'A.123.456', 'B']);
      expect(getProductIds(store.state)).toEqual(['P1', 'P2']);
    }));

    it('should have all required actions when going to a family page', fakeAsync(() => {
      expect(store.actionsArray()).toMatchInlineSnapshot(`
        @ngrx/router-store/request:
          routerState: {"url":"","params":{},"queryParams":{},"data":{}}
          event: {"id":1,"url":"/category/A.123.456"}
        @ngrx/router-store/navigation:
          routerState: {"url":"/category/A.123.456","params":{"categoryUniqueId":"A...
          event: {"id":1,"url":"/category/A.123.456"}
        [Shopping] Select Category:
          categoryId: "A.123.456"
        [Configuration Internal] Get the ICM configuration
        [Shopping] Load Category:
          categoryId: "A.123.456"
        [Shopping] Load Category Success:
          categories: tree(A.123.456)
        [Shopping] Selected Category Available:
          categoryId: "A.123.456"
        [ProductListing] Load More Products:
          id: {"type":"category","value":"A.123.456"}
        [Shopping] Load Category:
          categoryId: "A"
        [Shopping] Load Category:
          categoryId: "A.123"
        [ProductListing Internal] Load More Products For Params:
          id: {"type":"category","value":"A.123.456"}
          filters: undefined
          sorting: undefined
          page: undefined
        [Shopping] Load Category Success:
          categories: tree(A,A.123)
        [Shopping] Load Category Success:
          categories: tree(A.123,A.123.456)
        [Shopping] Load Products for Category:
          categoryId: "A.123.456"
          page: undefined
          sorting: undefined
        [Shopping] Load Filter For Category:
          uniqueId: "A.123.456"
        [ProductListing] Load More Products:
          id: {"type":"category","value":"A.123.456"}
        [ProductListing] Load More Products:
          id: {"type":"category","value":"A.123.456"}
        [Shopping] Load Product Success:
          product: {"sku":"P1"}
        [Shopping] Load Product Success:
          product: {"sku":"P2"}
        [ProductListing] Set Product Listing Pages:
          1: ["P1","P2"]
          id: {"type":"category","value":"A.123.456"}
          itemCount: 2
          sortKeys: []
        [Shopping] Load Filter Success:
          filterNavigation: {}
        [ProductListing] Set Product Listing Pages:
          id: {"type":"category","value":"A.123.456"}
        @ngrx/router-store/navigated:
          routerState: {"url":"/category/A.123.456","params":{"categoryUniqueId":"A...
          event: {"id":1,"url":"/category/A.123.456"}
        [Shopping] Load top level categories:
          depth: 1
        [Shopping] Load top level categories success:
          categories: tree(A,A.123,B)
        [ProductListing] Load More Products:
          id: {"type":"category","value":"A.123.456"}
      `);
    }));

    it('should not put anything in recently viewed products when going to a family page', fakeAsync(() => {
      expect(getRecentlyViewedProducts(store.state)).toBeEmpty();
    }));

    describe('and clicking a product', () => {
      beforeEach(fakeAsync(() => {
        store.reset();
        router.navigate(['/category', 'A.123.456', 'product', 'P1']);
        tick(5000);
      }));

      it('should reload the product when selected', fakeAsync(() => {
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          @ngrx/router-store/request:
            routerState: {"url":"/category/A.123.456","params":{"categoryUniqueId":"A...
            event: {"id":2,"url":"/category/A.123.456/product/P1"}
          @ngrx/router-store/navigation:
            routerState: {"url":"/category/A.123.456/product/P1","params":{"categoryU...
            event: {"id":2,"url":"/category/A.123.456/product/P1"}
          [Shopping] Select Product:
            sku: "P1"
          [Configuration Internal] Get the ICM configuration
          [Recently Viewed] Add Product to Recently:
            sku: "P1"
            group: undefined
          [Shopping] Load Product:
            sku: "P1"
          [Shopping] Load Product Success:
            product: {"sku":"P1"}
          @ngrx/router-store/navigated:
            routerState: {"url":"/category/A.123.456/product/P1","params":{"categoryU...
            event: {"id":2,"url":"/category/A.123.456/product/P1"}
        `);
      }));

      it('should add the product to recently viewed products when going to product detail page', fakeAsync(() => {
        expect(getRecentlyViewedProducts(store.state)).toEqual(['P1']);
      }));

      describe('and and going back to the family page', () => {
        beforeEach(fakeAsync(() => {
          store.reset();
          router.navigate(['/category', 'A.123.456']);
          tick(5000);
        }));

        it('should deselect product when navigating back', fakeAsync(() => {
          expect(store.actionsArray()).toMatchInlineSnapshot(`
            @ngrx/router-store/request:
              routerState: {"url":"/category/A.123.456/product/P1","params":{"categoryU...
              event: {"id":3,"url":"/category/A.123.456"}
            @ngrx/router-store/navigation:
              routerState: {"url":"/category/A.123.456","params":{"categoryUniqueId":"A...
              event: {"id":3,"url":"/category/A.123.456"}
            [Shopping] Select Product:
              sku: undefined
            [Configuration Internal] Get the ICM configuration
            @ngrx/router-store/navigated:
              routerState: {"url":"/category/A.123.456","params":{"categoryUniqueId":"A...
              event: {"id":3,"url":"/category/A.123.456"}
          `);
        }));
      });
    });

    describe('and searching for all products', () => {
      beforeEach(fakeAsync(() => {
        store.reset();
        router.navigate(['/search', 'something']);
        tick(5000);
      }));

      it('should load the right filters for search', fakeAsync(() => {
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          @ngrx/router-store/request:
            routerState: {"url":"/category/A.123.456","params":{"categoryUniqueId":"A...
            event: {"id":2,"url":"/search/something"}
          @ngrx/router-store/navigation:
            routerState: {"url":"/search/something","params":{"searchTerm":"something...
            event: {"id":2,"url":"/search/something"}
          [Shopping] Deselect Category
          [Shopping] Set Search Term:
            searchTerm: "something"
          [Configuration Internal] Get the ICM configuration
          [ProductListing] Load More Products:
            id: {"type":"search","value":"something"}
          [ProductListing Internal] Load More Products For Params:
            id: {"type":"search","value":"something"}
            filters: undefined
            sorting: undefined
            page: undefined
          [Shopping] Search Products:
            searchTerm: "something"
            page: undefined
            sorting: undefined
          [Shopping] Load Filter for Search:
            searchTerm: "something"
          [Shopping] Load Product Success:
            product: {"sku":"P2"}
          [ProductListing] Set Product Listing Pages:
            1: ["P2"]
            id: {"type":"search","value":"something"}
            itemCount: 1
            sortKeys: []
          [Shopping] Load Filter Success:
            filterNavigation: {}
          [ProductListing] Set Product Listing Pages:
            id: {"type":"search","value":"something"}
          @ngrx/router-store/navigated:
            routerState: {"url":"/search/something","params":{"searchTerm":"something...
            event: {"id":2,"url":"/search/something"}
        `);
      }));

      describe('and going back to family page', () => {
        beforeEach(fakeAsync(() => {
          store.reset();
          router.navigate(['/category', 'A.123.456']);
          tick(5000);
        }));

        it('should load the right filters for family page again', fakeAsync(() => {
          expect(store.actionsArray()).toMatchInlineSnapshot(`
            @ngrx/router-store/request:
              routerState: {"url":"/search/something","params":{"searchTerm":"something...
              event: {"id":3,"url":"/category/A.123.456"}
            @ngrx/router-store/navigation:
              routerState: {"url":"/category/A.123.456","params":{"categoryUniqueId":"A...
              event: {"id":3,"url":"/category/A.123.456"}
            [Shopping] Select Category:
              categoryId: "A.123.456"
            [Configuration Internal] Get the ICM configuration
            [ProductListing] Load More Products:
              id: {"type":"category","value":"A.123.456"}
            [ProductListing Internal] Load More Products For Params:
              id: {"type":"category","value":"A.123.456"}
              filters: undefined
              sorting: undefined
              page: undefined
            [ProductListing] Set Product Listing Pages:
              id: {"type":"category","value":"A.123.456"}
            [Shopping] Load Filter For Category:
              uniqueId: "A.123.456"
            [Shopping] Load Filter Success:
              filterNavigation: {}
            @ngrx/router-store/navigated:
              routerState: {"url":"/category/A.123.456","params":{"categoryUniqueId":"A...
              event: {"id":3,"url":"/category/A.123.456"}
          `);
        }));
      });
    });

    describe('and and going to compare page', () => {
      beforeEach(fakeAsync(() => {
        store.reset();
        router.navigate(['/compare']);
        tick(5000);
      }));

      it('should not load anything additionally when going to compare page', fakeAsync(() => {
        expect(getCategoryIds(store.state)).toBeArrayOfSize(4);
        expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'A.123.456', 'B']);
        expect(getProductIds(store.state)).toEqual(['P1', 'P2']);
      }));

      it('should trigger actions for deselecting category and product when no longer in category or product', fakeAsync(() => {
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          @ngrx/router-store/request:
            routerState: {"url":"/category/A.123.456","params":{"categoryUniqueId":"A...
            event: {"id":2,"url":"/compare"}
          @ngrx/router-store/navigation:
            routerState: {"url":"/compare","params":{},"queryParams":{},"data":{}}
            event: {"id":2,"url":"/compare"}
          [Shopping] Deselect Category
          [Configuration Internal] Get the ICM configuration
          @ngrx/router-store/navigated:
            routerState: {"url":"/compare","params":{},"queryParams":{},"data":{}}
            event: {"id":2,"url":"/compare"}
        `);
      }));

      it('should not have a selected product or category when redirected to error page', fakeAsync(() => {
        expect(getSelectedCategory(store.state)).toBeUndefined();
        expect(getSelectedProduct(store.state)).toBeUndefined();
      }));
    });
  });

  describe('product page', () => {
    beforeEach(fakeAsync(() => {
      router.navigate(['/category', 'A.123.456', 'product', 'P1']);
      tick(5000);
    }));

    it('should load the product and its required categories when going to a product page', fakeAsync(() => {
      expect(getCategoryIds(store.state)).toBeArrayOfSize(4);
      expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'A.123.456', 'B']);
      expect(getProductIds(store.state)).toEqual(['P1']);
    }));

    it('should trigger required load actions when going to a product page', fakeAsync(() => {
      expect(store.actionsArray()).toMatchInlineSnapshot(`
        @ngrx/router-store/request:
          routerState: {"url":"","params":{},"queryParams":{},"data":{}}
          event: {"id":1,"url":"/category/A.123.456/product/P1"}
        @ngrx/router-store/navigation:
          routerState: {"url":"/category/A.123.456/product/P1","params":{"categoryU...
          event: {"id":1,"url":"/category/A.123.456/product/P1"}
        [Shopping] Select Category:
          categoryId: "A.123.456"
        [Shopping] Select Product:
          sku: "P1"
        [Configuration Internal] Get the ICM configuration
        [Shopping] Load Category:
          categoryId: "A.123.456"
        [Shopping] Load Product:
          sku: "P1"
        [Shopping] Load Category Success:
          categories: tree(A.123.456)
        [Shopping] Load Product Success:
          product: {"sku":"P1"}
        [Shopping] Selected Category Available:
          categoryId: "A.123.456"
        [Recently Viewed] Add Product to Recently:
          sku: "P1"
          group: undefined
        [Shopping] Load Category:
          categoryId: "A"
        [Shopping] Load Category:
          categoryId: "A.123"
        [Shopping] Load Category Success:
          categories: tree(A,A.123)
        [Shopping] Load Category Success:
          categories: tree(A.123,A.123.456)
        @ngrx/router-store/navigated:
          routerState: {"url":"/category/A.123.456/product/P1","params":{"categoryU...
          event: {"id":1,"url":"/category/A.123.456/product/P1"}
        [Shopping] Load top level categories:
          depth: 1
        [Shopping] Load top level categories success:
          categories: tree(A,A.123,B)
      `);
    }));

    it('should put the product to recently viewed products when going to product detail page', fakeAsync(() => {
      expect(getRecentlyViewedProducts(store.state)).toEqual(['P1']);
    }));

    describe('and and going back to the family page', () => {
      beforeEach(fakeAsync(() => {
        store.reset();
        router.navigate(['/category', 'A.123.456']);
        tick(5000);
      }));

      it('should load the sibling products when they are not yet loaded', fakeAsync(() => {
        expect(getCategoryIds(store.state)).toBeArrayOfSize(4);
        expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'A.123.456', 'B']);
        expect(getProductIds(store.state)).toEqual(['P1', 'P2']);
      }));

      it('should trigger actions for products when they are not yet loaded', fakeAsync(() => {
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          @ngrx/router-store/request:
            routerState: {"url":"/category/A.123.456/product/P1","params":{"categoryU...
            event: {"id":2,"url":"/category/A.123.456"}
          @ngrx/router-store/navigation:
            routerState: {"url":"/category/A.123.456","params":{"categoryUniqueId":"A...
            event: {"id":2,"url":"/category/A.123.456"}
          [ProductListing] Load More Products:
            id: {"type":"category","value":"A.123.456"}
          [Shopping] Select Product:
            sku: undefined
          [Configuration Internal] Get the ICM configuration
          [ProductListing Internal] Load More Products For Params:
            id: {"type":"category","value":"A.123.456"}
            filters: undefined
            sorting: undefined
            page: undefined
          [Shopping] Load Products for Category:
            categoryId: "A.123.456"
            page: undefined
            sorting: undefined
          [Shopping] Load Filter For Category:
            uniqueId: "A.123.456"
          [Shopping] Load Product Success:
            product: {"sku":"P1"}
          [Shopping] Load Product Success:
            product: {"sku":"P2"}
          [ProductListing] Set Product Listing Pages:
            1: ["P1","P2"]
            id: {"type":"category","value":"A.123.456"}
            itemCount: 2
            sortKeys: []
          [Shopping] Load Filter Success:
            filterNavigation: {}
          [ProductListing] Set Product Listing Pages:
            id: {"type":"category","value":"A.123.456"}
          @ngrx/router-store/navigated:
            routerState: {"url":"/category/A.123.456","params":{"categoryUniqueId":"A...
            event: {"id":2,"url":"/category/A.123.456"}
        `);
      }));

      it('should not put anything additionally to recently viewed products when going back', fakeAsync(() => {
        expect(getRecentlyViewedProducts(store.state)).toEqual(['P1']);
      }));
    });

    describe('and and going to compare page', () => {
      beforeEach(fakeAsync(() => {
        store.reset();
        router.navigate(['/compare']);
        tick(5000);
      }));

      it('should not load anything additionally when going to compare page', fakeAsync(() => {
        expect(getCategoryIds(store.state)).toBeArrayOfSize(4);
        expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'A.123.456', 'B']);
        expect(getProductIds(store.state)).toEqual(['P1']);
      }));

      it('should trigger actions for deselecting category and product when no longer in category or product', fakeAsync(() => {
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          @ngrx/router-store/request:
            routerState: {"url":"/category/A.123.456/product/P1","params":{"categoryU...
            event: {"id":2,"url":"/compare"}
          @ngrx/router-store/navigation:
            routerState: {"url":"/compare","params":{},"queryParams":{},"data":{}}
            event: {"id":2,"url":"/compare"}
          [Shopping] Deselect Category
          [Shopping] Select Product:
            sku: undefined
          [Configuration Internal] Get the ICM configuration
          @ngrx/router-store/navigated:
            routerState: {"url":"/compare","params":{},"queryParams":{},"data":{}}
            event: {"id":2,"url":"/compare"}
        `);
      }));

      it('should not have a selected product or category when redirected to error page', fakeAsync(() => {
        expect(getSelectedCategory(store.state)).toBeUndefined();
        expect(getSelectedProduct(store.state)).toBeUndefined();
      }));
    });
  });

  describe('product page without category context', () => {
    beforeEach(fakeAsync(() => {
      router.navigate(['/product', 'P1']);
      tick(5000);
    }));

    it('should load the product ang top level categories when going to a product page', fakeAsync(() => {
      expect(getCategoryIds(store.state)).toBeArrayOfSize(3);
      expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'B']);
      expect(getProductIds(store.state)).toEqual(['P1']);
    }));

    it('should trigger required load actions when going to a product page', fakeAsync(() => {
      expect(store.actionsArray()).toMatchInlineSnapshot(`
        @ngrx/router-store/request:
          routerState: {"url":"","params":{},"queryParams":{},"data":{}}
          event: {"id":1,"url":"/product/P1"}
        @ngrx/router-store/navigation:
          routerState: {"url":"/product/P1","params":{"sku":"P1"},"queryParams":{},...
          event: {"id":1,"url":"/product/P1"}
        [Shopping] Select Product:
          sku: "P1"
        [Configuration Internal] Get the ICM configuration
        [Shopping] Load Product:
          sku: "P1"
        [Shopping] Load Product Success:
          product: {"sku":"P1"}
        [Recently Viewed] Add Product to Recently:
          sku: "P1"
          group: undefined
        @ngrx/router-store/navigated:
          routerState: {"url":"/product/P1","params":{"sku":"P1"},"queryParams":{},...
          event: {"id":1,"url":"/product/P1"}
        [Shopping] Load top level categories:
          depth: 1
        [Shopping] Load top level categories success:
          categories: tree(A,A.123,B)
      `);
    }));

    describe('and and going to compare page', () => {
      beforeEach(fakeAsync(() => {
        store.reset();
        router.navigate(['/compare']);
        tick(5000);
      }));

      it('should not load anything additionally when going to compare page', fakeAsync(() => {
        expect(getCategoryIds(store.state)).toBeArrayOfSize(3);
        expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'B']);
        expect(getProductIds(store.state)).toEqual(['P1']);
      }));

      it('should trigger actions for deselecting category and product when no longer in category or product', fakeAsync(() => {
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          @ngrx/router-store/request:
            routerState: {"url":"/product/P1","params":{"sku":"P1"},"queryParams":{},...
            event: {"id":2,"url":"/compare"}
          @ngrx/router-store/navigation:
            routerState: {"url":"/compare","params":{},"queryParams":{},"data":{}}
            event: {"id":2,"url":"/compare"}
          [Shopping] Select Product:
            sku: undefined
          [Configuration Internal] Get the ICM configuration
          @ngrx/router-store/navigated:
            routerState: {"url":"/compare","params":{},"queryParams":{},"data":{}}
            event: {"id":2,"url":"/compare"}
        `);
      }));

      it('should not have a selected product or category when redirected to error page', fakeAsync(() => {
        expect(getSelectedCategory(store.state)).toBeUndefined();
        expect(getSelectedProduct(store.state)).toBeUndefined();
      }));
    });
  });

  describe('product page with invalid product', () => {
    beforeEach(fakeAsync(() => {
      router.navigate(['/category', 'A.123.456', 'product', 'P3']);
      tick(5000);
    }));

    it('should load only family page content and redirect to error when product was not found', fakeAsync(() => {
      expect(getCategoryIds(store.state)).toBeArrayOfSize(4);
      expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'A.123.456', 'B']);
      expect(getProductIds(store.state)).toBeEmpty();
    }));

    it('should trigger required load actions when going to a product page with invalid product sku', fakeAsync(() => {
      expect(store.actionsArray()).toMatchInlineSnapshot(`
        @ngrx/router-store/request:
          routerState: {"url":"","params":{},"queryParams":{},"data":{}}
          event: {"id":1,"url":"/category/A.123.456/product/P3"}
        @ngrx/router-store/navigation:
          routerState: {"url":"/category/A.123.456/product/P3","params":{"categoryU...
          event: {"id":1,"url":"/category/A.123.456/product/P3"}
        [Shopping] Select Category:
          categoryId: "A.123.456"
        [Shopping] Select Product:
          sku: "P3"
        [Configuration Internal] Get the ICM configuration
        [Shopping] Load Category:
          categoryId: "A.123.456"
        [Shopping] Load Product:
          sku: "P3"
        [Shopping] Load Category Success:
          categories: tree(A.123.456)
        [Shopping] Load Product Fail:
          error: {"message":"error loading product P3"}
          sku: "P3"
        [Shopping] Selected Category Available:
          categoryId: "A.123.456"
        @ngrx/router-store/cancel:
          routerState: {"url":"","params":{},"queryParams":{},"data":{}}
          storeState: {"user":{"authorized":false,"loading":false},"addresses":{"i...
          event: {"id":1,"url":"/category/A.123.456/product/P3"}
        @ngrx/router-store/request:
          routerState: {"url":"","params":{},"queryParams":{},"data":{}}
          event: {"id":2,"url":"/error"}
        [Shopping] Load Category:
          categoryId: "A"
        [Shopping] Load Category:
          categoryId: "A.123"
        [Shopping] Deselect Category
        [Shopping] Select Product:
          sku: undefined
        [Shopping] Load Category Success:
          categories: tree(A,A.123)
        [Shopping] Load Category Success:
          categories: tree(A.123,A.123.456)
        @ngrx/router-store/navigation:
          routerState: {"url":"/error","params":{},"queryParams":{},"data":{}}
          event: {"id":2,"url":"/error"}
        [Configuration Internal] Get the ICM configuration
        @ngrx/router-store/navigated:
          routerState: {"url":"/error","params":{},"queryParams":{},"data":{}}
          event: {"id":2,"url":"/error"}
        [Shopping] Load top level categories:
          depth: 1
        [Shopping] Load top level categories success:
          categories: tree(A,A.123,B)
      `);
    }));

    it('should not have a selected product or category when redirected to error page', fakeAsync(() => {
      expect(getSelectedCategory(store.state)).toBeUndefined();
      expect(getSelectedProduct(store.state)).toBeUndefined();
    }));

    it('should not put anything to recently viewed products when invalid product was selected', fakeAsync(() => {
      expect(getRecentlyViewedProducts(store.state)).toBeEmpty();
    }));
  });

  describe('category page with invalid category', () => {
    beforeEach(fakeAsync(() => {
      router.navigate(['/category', 'A.123.XXX']);
      tick(5000);
    }));

    it('should load only some categories and redirect to error when category was not found', fakeAsync(() => {
      expect(getCategoryIds(store.state)).toBeArrayOfSize(3);
      expect(getCategoryIds(store.state)).toIncludeAllMembers(['A', 'A.123', 'B']);
      expect(getProductIds(store.state)).toBeEmpty();
    }));

    it('should trigger required load actions when going to a category page with invalid category uniqueId', fakeAsync(() => {
      expect(store.actionsArray()).toMatchInlineSnapshot(`
        @ngrx/router-store/request:
          routerState: {"url":"","params":{},"queryParams":{},"data":{}}
          event: {"id":1,"url":"/category/A.123.XXX"}
        @ngrx/router-store/navigation:
          routerState: {"url":"/category/A.123.XXX","params":{"categoryUniqueId":"A...
          event: {"id":1,"url":"/category/A.123.XXX"}
        [Shopping] Select Category:
          categoryId: "A.123.XXX"
        [Configuration Internal] Get the ICM configuration
        [Shopping] Load Category:
          categoryId: "A.123.XXX"
        [Shopping] Load Category Fail:
          error: {"message":"error loading category A.123.XXX"}
        @ngrx/router-store/cancel:
          routerState: {"url":"","params":{},"queryParams":{},"data":{}}
          storeState: {"user":{"authorized":false,"loading":false},"addresses":{"i...
          event: {"id":1,"url":"/category/A.123.XXX"}
        @ngrx/router-store/request:
          routerState: {"url":"","params":{},"queryParams":{},"data":{}}
          event: {"id":2,"url":"/error"}
        [Shopping] Deselect Category
        @ngrx/router-store/navigation:
          routerState: {"url":"/error","params":{},"queryParams":{},"data":{}}
          event: {"id":2,"url":"/error"}
        [Configuration Internal] Get the ICM configuration
        @ngrx/router-store/navigated:
          routerState: {"url":"/error","params":{},"queryParams":{},"data":{}}
          event: {"id":2,"url":"/error"}
        [Shopping] Load top level categories:
          depth: 1
        [Shopping] Load top level categories success:
          categories: tree(A,A.123,B)
      `);
    }));

    it('should not have a selected product or category when redirected to error page', fakeAsync(() => {
      expect(getSelectedCategory(store.state)).toBeUndefined();
      expect(getSelectedProduct(store.state)).toBeUndefined();
    }));
  });

  describe('searching for something', () => {
    beforeEach(fakeAsync(() => {
      router.navigate(['/search', 'something']);
      tick(5000);
    }));

    it('should load the product for the search results', fakeAsync(() => {
      expect(getProductIds(store.state)).toEqual(['P2']);
    }));

    it('should trigger required actions when searching', fakeAsync(() => {
      expect(store.actionsArray()).toMatchInlineSnapshot(`
        @ngrx/router-store/request:
          routerState: {"url":"","params":{},"queryParams":{},"data":{}}
          event: {"id":1,"url":"/search/something"}
        @ngrx/router-store/navigation:
          routerState: {"url":"/search/something","params":{"searchTerm":"something...
          event: {"id":1,"url":"/search/something"}
        [Shopping] Set Search Term:
          searchTerm: "something"
        [Configuration Internal] Get the ICM configuration
        [ProductListing] Load More Products:
          id: {"type":"search","value":"something"}
        [ProductListing Internal] Load More Products For Params:
          id: {"type":"search","value":"something"}
          filters: undefined
          sorting: undefined
          page: undefined
        [Shopping] Search Products:
          searchTerm: "something"
          page: undefined
          sorting: undefined
        [Shopping] Load Filter for Search:
          searchTerm: "something"
        [Shopping] Load Product Success:
          product: {"sku":"P2"}
        [ProductListing] Set Product Listing Pages:
          1: ["P2"]
          id: {"type":"search","value":"something"}
          itemCount: 1
          sortKeys: []
        [Shopping] Load Filter Success:
          filterNavigation: {}
        [ProductListing] Set Product Listing Pages:
          id: {"type":"search","value":"something"}
        @ngrx/router-store/navigated:
          routerState: {"url":"/search/something","params":{"searchTerm":"something...
          event: {"id":1,"url":"/search/something"}
        [Shopping] Load top level categories:
          depth: 1
        [Shopping] Load top level categories success:
          categories: tree(A,A.123,B)
      `);
    }));
  });
});
