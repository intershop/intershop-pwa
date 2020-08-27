import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { createSelector } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { EMPTY, of, throwError } from 'rxjs';
import { anyNumber, anyString, anything, instance, mock, when } from 'ts-mockito';

import {
  DEFAULT_PRODUCT_LISTING_VIEW_TYPE,
  LARGE_BREAKPOINT_WIDTH,
  MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH,
  MEDIUM_BREAKPOINT_WIDTH,
  PRODUCT_LISTING_ITEMS_PER_PAGE,
} from 'ish-core/configurations/injection-keys';
import { Category, CategoryCompletenessLevel } from 'ish-core/models/category/category.model';
import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
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
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import { getCategoryTree, getSelectedCategory } from './categories';
import { getProductEntities, getSelectedProduct } from './products';
import { getRecentlyViewedProducts } from './recently';
import { suggestSearch } from './search';
import { ShoppingStoreModule } from './shopping-store.module';

const getCategoryIds = createSelector(getCategoryTree, tree => Object.keys(tree.nodes));

const getProductIds = createSelector(getProductEntities, entities => Object.keys(entities));

describe('Shopping Store', () => {
  let store: StoreWithSnapshots;
  let router: Router;
  let categoriesServiceMock: CategoriesService;
  let productsServiceMock: ProductsService;
  let promotionsServiceMock: PromotionsService;
  let suggestServiceMock: SuggestService;
  let filterServiceMock: FilterService;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    const catA = { uniqueId: 'A', categoryPath: ['A'], name: 'nA' } as Category;
    const catA123 = { uniqueId: 'A.123', categoryPath: ['A', 'A.123'], name: 'nA123' } as Category;
    const catA123456 = {
      uniqueId: 'A.123.456',
      categoryPath: ['A', 'A.123', 'A.123.456'],
      hasOnlineProducts: true,
      name: 'nA123456',
    } as Category;
    const catB = { uniqueId: 'B', categoryPath: ['B'], name: 'nB' } as Category;

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
          return throwError(makeHttpError({ message: `error loading category ${uniqueId}` }));
      }
    });

    const configurationServiceMock = mock(ConfigurationService);
    when(configurationServiceMock.getServerConfiguration()).thenReturn(of({}));

    const countryServiceMock = mock(CountryService);
    when(countryServiceMock.getCountries()).thenReturn(EMPTY);

    productsServiceMock = mock(ProductsService);
    when(productsServiceMock.getProduct(anyString())).thenCall(sku => {
      if (['P1', 'P2'].find(x => x === sku)) {
        return of({ sku, name: 'n' + sku });
      } else {
        return throwError(makeHttpError({ message: `error loading product ${sku}` }));
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
        CoreStoreModule.forTesting(['router', 'configuration'], true),
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
            data: { headerType: 'simple' },
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
        ShoppingStoreModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
      ],
      providers: [
        provideStoreSnapshots(),
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
        { provide: PRODUCT_LISTING_ITEMS_PER_PAGE, useValue: 3 },
        { provide: MEDIUM_BREAKPOINT_WIDTH, useValue: 768 },
        { provide: LARGE_BREAKPOINT_WIDTH, useValue: 992 },
        { provide: DEFAULT_PRODUCT_LISTING_VIEW_TYPE, useValue: 'list' },
      ],
    });

    store = TestBed.inject(StoreWithSnapshots);
    router = TestBed.inject(Router);
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
          routerState: {"url":"/home","params":{},"queryParams":{},"data":{},"path"...
          event: {"id":1,"url":"/home"}
        @ngrx/router-store/navigated:
          routerState: {"url":"/home","params":{},"queryParams":{},"data":{},"path"...
          event: {"id":1,"url":"/home"}
      `);

      expect(getCategoryIds(store.state)).toBeEmpty();
      expect(getProductIds(store.state)).toBeEmpty();
    }));

    describe('and going to a category page', () => {
      beforeEach(fakeAsync(() => {
        store.reset();
        router.navigate(['/category', 'A.123']);
        tick(5000);
      }));

      it('should load necessary data when going to a category page', fakeAsync(() => {
        expect(getCategoryIds(store.state)).toMatchInlineSnapshot(`
          Array [
            "A.123",
            "A.123.456",
            "A",
          ]
        `);
        expect(getProductIds(store.state)).toBeEmpty();
      }));

      it('should have toplevel loading and category loading actions when going to a category page', fakeAsync(() => {
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          @ngrx/router-store/request:
            routerState: {"url":"/home","params":{},"queryParams":{},"data":{},"path"...
            event: {"id":2,"url":"/category/A.123"}
          @ngrx/router-store/navigation:
            routerState: {"url":"/category/A.123","params":{"categoryUniqueId":"A.123...
            event: {"id":2,"url":"/category/A.123"}
          [Categories Internal] Load Category:
            categoryId: "A.123"
          [Categories API] Load Category Success:
            categories: tree(A.123,A.123.456)
          [Categories Internal] Load Category:
            categoryId: "A"
          [Viewconf Internal] Set Breadcrumb Data:
            breadcrumbData: [{"text":"nA123"}]
          [Categories API] Load Category Success:
            categories: tree(A,A.123)
          [Viewconf Internal] Set Breadcrumb Data:
            breadcrumbData: [{"text":"nA","link":"/nA-catA"},{"text":"nA123"}]
          @ngrx/router-store/navigated:
            routerState: {"url":"/category/A.123","params":{"categoryUniqueId":"A.123...
            event: {"id":2,"url":"/category/A.123"}
          [Viewconf Internal] Set Breadcrumb Data:
            breadcrumbData: [{"text":"nA","link":"/nA-catA"},{"text":"nA123"}]
        `);
      }));
    });

    describe('and looking for suggestions', () => {
      beforeEach(fakeAsync(() => {
        store.reset();
        store.dispatch(suggestSearch({ searchTerm: 'some' }));
        tick(5000);
      }));

      it('should trigger suggest actions when suggest feature is used', () => {
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          [Suggest Search Internal] Load Search Suggestions:
            searchTerm: "some"
          [Suggest Search API] Return Search Suggestions:
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
            routerState: {"url":"/home","params":{},"queryParams":{},"data":{},"path"...
            event: {"id":2,"url":"/search/something"}
          @ngrx/router-store/navigation:
            routerState: {"url":"/search/something","params":{"searchTerm":"something...
            event: {"id":2,"url":"/search/something"}
          [Viewconf Internal] Set Breadcrumb Data:
            breadcrumbData: [{"text":"search.breadcrumbs.your_search.label something"}]
          @ngrx/router-store/navigated:
            routerState: {"url":"/search/something","params":{"searchTerm":"something...
            event: {"id":2,"url":"/search/something"}
          [Product Listing] Load More Products:
            id: {"type":"search","value":"something"}
          [Viewconf Internal] Set Breadcrumb Data:
            breadcrumbData: [{"text":"search.breadcrumbs.your_search.label something"}]
          [Product Listing Internal] Load More Products For Params:
            id: {"type":"search","value":"something"}
            filters: undefined
            sorting: undefined
            page: undefined
          [Search Internal] Search Products:
            searchTerm: "something"
            page: undefined
            sorting: undefined
          [Filter Internal] Load Filter for Search:
            searchTerm: "something"
          [Products API] Load Product Success:
            product: {"sku":"P2"}
          [Product Listing Internal] Set Product Listing Pages:
            1: ["P2"]
            id: {"type":"search","value":"something"}
            itemCount: 1
            sortKeys: []
          [Filter API] Load Filter Success:
            filterNavigation: {}
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
            [Products Internal] Load Product:
              sku: "P2"
            [Recently Viewed Internal] Add Product to Recently:
              sku: "P2"
              group: undefined
            [Products API] Load Product Success:
              product: {"sku":"P2","name":"nP2"}
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
      expect(getCategoryIds(store.state)).toMatchInlineSnapshot(`
        Array [
          "A.123",
          "A.123.456",
          "A",
        ]
      `);
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
        [Categories Internal] Load Category:
          categoryId: "A.123"
        [Categories API] Load Category Success:
          categories: tree(A.123,A.123.456)
        [Categories Internal] Load Category:
          categoryId: "A"
        [Categories API] Load Category Success:
          categories: tree(A,A.123)
        @ngrx/router-store/navigated:
          routerState: {"url":"/category/A.123","params":{"categoryUniqueId":"A.123...
          event: {"id":1,"url":"/category/A.123"}
        [Viewconf Internal] Set Breadcrumb Data:
          breadcrumbData: [{"text":"nA","link":"/nA-catA"},{"text":"nA123"}]
      `);
    }));

    describe('and and going to compare page', () => {
      beforeEach(fakeAsync(() => {
        store.reset();
        router.navigate(['/compare']);
        tick(5000);
      }));

      it('should not load anything additionally when going to compare page', fakeAsync(() => {
        expect(getCategoryIds(store.state)).toMatchInlineSnapshot(`
          Array [
            "A.123",
            "A.123.456",
            "A",
          ]
        `);
        expect(getProductIds(store.state)).toBeEmpty();
      }));

      it('should trigger actions for deselecting category and product when no longer in category or product', fakeAsync(() => {
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          @ngrx/router-store/request:
            routerState: {"url":"/category/A.123","params":{"categoryUniqueId":"A.123...
            event: {"id":2,"url":"/compare"}
          @ngrx/router-store/navigation:
            routerState: {"url":"/compare","params":{},"queryParams":{},"data":{},"pa...
            event: {"id":2,"url":"/compare"}
          @ngrx/router-store/navigated:
            routerState: {"url":"/compare","params":{},"queryParams":{},"data":{},"pa...
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
      expect(getCategoryIds(store.state)).toMatchInlineSnapshot(`
          Array [
            "A.123.456",
            "A",
            "A.123",
          ]
        `);
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
        [Categories Internal] Load Category:
          categoryId: "A.123.456"
        [Categories API] Load Category Success:
          categories: tree(A.123.456)
        [Categories Internal] Load Category:
          categoryId: "A"
        [Categories Internal] Load Category:
          categoryId: "A.123"
        [Categories API] Load Category Success:
          categories: tree(A,A.123)
        [Categories API] Load Category Success:
          categories: tree(A.123,A.123.456)
        @ngrx/router-store/navigated:
          routerState: {"url":"/category/A.123.456","params":{"categoryUniqueId":"A...
          event: {"id":1,"url":"/category/A.123.456"}
        [Product Listing] Load More Products:
          id: {"type":"category","value":"A.123.456"}
        [Viewconf Internal] Set Breadcrumb Data:
          breadcrumbData: [{"text":"nA","link":"/nA-catA"},{"text":"nA123","link":"/nA...
        [Product Listing Internal] Load More Products For Params:
          id: {"type":"category","value":"A.123.456"}
          filters: undefined
          sorting: undefined
          page: undefined
        [Products Internal] Load Products for Category:
          categoryId: "A.123.456"
          page: undefined
          sorting: undefined
        [Filter Internal] Load Filter For Category:
          uniqueId: "A.123.456"
        [Products API] Load Product Success:
          product: {"sku":"P1"}
        [Products API] Load Product Success:
          product: {"sku":"P2"}
        [Product Listing Internal] Set Product Listing Pages:
          1: ["P1","P2"]
          id: {"type":"category","value":"A.123.456"}
          itemCount: 2
          sortKeys: []
        [Filter API] Load Filter Success:
          filterNavigation: {}
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
          [Products Internal] Load Product:
            sku: "P1"
          [Recently Viewed Internal] Add Product to Recently:
            sku: "P1"
            group: undefined
          [Products API] Load Product Success:
            product: {"sku":"P1","name":"nP1"}
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
            [Product Listing] Load More Products:
              id: {"type":"category","value":"A.123.456"}
            [Viewconf Internal] Set Breadcrumb Data:
              breadcrumbData: [{"text":"nA","link":"/nA-catA"},{"text":"nA123","link":"/nA...
            @ngrx/router-store/navigated:
              routerState: {"url":"/category/A.123.456","params":{"categoryUniqueId":"A...
              event: {"id":3,"url":"/category/A.123.456"}
            [Product Listing] Load More Products:
              id: {"type":"category","value":"A.123.456"}
            [Viewconf Internal] Set Breadcrumb Data:
              breadcrumbData: [{"text":"nA","link":"/nA-catA"},{"text":"nA123","link":"/nA...
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
          [Viewconf Internal] Set Breadcrumb Data:
            breadcrumbData: [{"text":"search.breadcrumbs.your_search.label something"}]
          @ngrx/router-store/navigated:
            routerState: {"url":"/search/something","params":{"searchTerm":"something...
            event: {"id":2,"url":"/search/something"}
          [Product Listing] Load More Products:
            id: {"type":"search","value":"something"}
          [Viewconf Internal] Set Breadcrumb Data:
            breadcrumbData: [{"text":"search.breadcrumbs.your_search.label something"}]
          [Product Listing Internal] Load More Products For Params:
            id: {"type":"search","value":"something"}
            filters: undefined
            sorting: undefined
            page: undefined
          [Search Internal] Search Products:
            searchTerm: "something"
            page: undefined
            sorting: undefined
          [Filter Internal] Load Filter for Search:
            searchTerm: "something"
          [Products API] Load Product Success:
            product: {"sku":"P2"}
          [Product Listing Internal] Set Product Listing Pages:
            1: ["P2"]
            id: {"type":"search","value":"something"}
            itemCount: 1
            sortKeys: []
          [Filter API] Load Filter Success:
            filterNavigation: {}
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
            [Product Listing] Load More Products:
              id: {"type":"category","value":"A.123.456"}
            [Viewconf Internal] Set Breadcrumb Data:
              breadcrumbData: [{"text":"nA","link":"/nA-catA"},{"text":"nA123","link":"/nA...
            [Product Listing Internal] Load More Products For Params:
              id: {"type":"category","value":"A.123.456"}
              filters: undefined
              sorting: undefined
              page: undefined
            [Product Listing Internal] Set Product Listing Pages:
              id: {"type":"category","value":"A.123.456"}
            [Filter Internal] Load Filter For Category:
              uniqueId: "A.123.456"
            [Filter API] Load Filter Success:
              filterNavigation: {}
            @ngrx/router-store/navigated:
              routerState: {"url":"/category/A.123.456","params":{"categoryUniqueId":"A...
              event: {"id":3,"url":"/category/A.123.456"}
            [Product Listing] Load More Products:
              id: {"type":"category","value":"A.123.456"}
            [Viewconf Internal] Set Breadcrumb Data:
              breadcrumbData: [{"text":"nA","link":"/nA-catA"},{"text":"nA123","link":"/nA...
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
        expect(getCategoryIds(store.state)).toMatchInlineSnapshot(`
          Array [
            "A.123.456",
            "A",
            "A.123",
          ]
        `);
        expect(getProductIds(store.state)).toEqual(['P1', 'P2']);
      }));

      it('should trigger actions for deselecting category and product when no longer in category or product', fakeAsync(() => {
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          @ngrx/router-store/request:
            routerState: {"url":"/category/A.123.456","params":{"categoryUniqueId":"A...
            event: {"id":2,"url":"/compare"}
          @ngrx/router-store/navigation:
            routerState: {"url":"/compare","params":{},"queryParams":{},"data":{},"pa...
            event: {"id":2,"url":"/compare"}
          @ngrx/router-store/navigated:
            routerState: {"url":"/compare","params":{},"queryParams":{},"data":{},"pa...
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
      expect(getCategoryIds(store.state)).toMatchInlineSnapshot(`
          Array [
            "A.123.456",
            "A",
            "A.123",
          ]
        `);
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
        [Categories Internal] Load Category:
          categoryId: "A.123.456"
        [Products Internal] Load Product:
          sku: "P1"
        [Categories API] Load Category Success:
          categories: tree(A.123.456)
        [Products API] Load Product Success:
          product: {"sku":"P1","name":"nP1"}
        [Categories Internal] Load Category:
          categoryId: "A"
        [Categories Internal] Load Category:
          categoryId: "A.123"
        [Recently Viewed Internal] Add Product to Recently:
          sku: "P1"
          group: undefined
        [Categories API] Load Category Success:
          categories: tree(A,A.123)
        [Categories API] Load Category Success:
          categories: tree(A.123,A.123.456)
        @ngrx/router-store/navigated:
          routerState: {"url":"/category/A.123.456/product/P1","params":{"categoryU...
          event: {"id":1,"url":"/category/A.123.456/product/P1"}
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
        expect(getCategoryIds(store.state)).toMatchInlineSnapshot(`
          Array [
            "A.123.456",
            "A",
            "A.123",
          ]
        `);
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
          [Product Listing] Load More Products:
            id: {"type":"category","value":"A.123.456"}
          [Viewconf Internal] Set Breadcrumb Data:
            breadcrumbData: [{"text":"nA","link":"/nA-catA"},{"text":"nA123","link":"/nA...
          [Product Listing Internal] Load More Products For Params:
            id: {"type":"category","value":"A.123.456"}
            filters: undefined
            sorting: undefined
            page: undefined
          [Products Internal] Load Products for Category:
            categoryId: "A.123.456"
            page: undefined
            sorting: undefined
          [Filter Internal] Load Filter For Category:
            uniqueId: "A.123.456"
          [Products API] Load Product Success:
            product: {"sku":"P1"}
          [Products API] Load Product Success:
            product: {"sku":"P2"}
          [Product Listing Internal] Set Product Listing Pages:
            1: ["P1","P2"]
            id: {"type":"category","value":"A.123.456"}
            itemCount: 2
            sortKeys: []
          [Filter API] Load Filter Success:
            filterNavigation: {}
          @ngrx/router-store/navigated:
            routerState: {"url":"/category/A.123.456","params":{"categoryUniqueId":"A...
            event: {"id":2,"url":"/category/A.123.456"}
          [Product Listing] Load More Products:
            id: {"type":"category","value":"A.123.456"}
          [Viewconf Internal] Set Breadcrumb Data:
            breadcrumbData: [{"text":"nA","link":"/nA-catA"},{"text":"nA123","link":"/nA...
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
        expect(getCategoryIds(store.state)).toMatchInlineSnapshot(`
          Array [
            "A.123.456",
            "A",
            "A.123",
          ]
        `);
        expect(getProductIds(store.state)).toEqual(['P1']);
      }));

      it('should trigger actions for deselecting category and product when no longer in category or product', fakeAsync(() => {
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          @ngrx/router-store/request:
            routerState: {"url":"/category/A.123.456/product/P1","params":{"categoryU...
            event: {"id":2,"url":"/compare"}
          @ngrx/router-store/navigation:
            routerState: {"url":"/compare","params":{},"queryParams":{},"data":{},"pa...
            event: {"id":2,"url":"/compare"}
          @ngrx/router-store/navigated:
            routerState: {"url":"/compare","params":{},"queryParams":{},"data":{},"pa...
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
      expect(getCategoryIds(store.state)).toBeEmpty();
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
        [Products Internal] Load Product:
          sku: "P1"
        [Products API] Load Product Success:
          product: {"sku":"P1","name":"nP1"}
        [Recently Viewed Internal] Add Product to Recently:
          sku: "P1"
          group: undefined
        @ngrx/router-store/navigated:
          routerState: {"url":"/product/P1","params":{"sku":"P1"},"queryParams":{},...
          event: {"id":1,"url":"/product/P1"}
      `);
    }));

    describe('and and going to compare page', () => {
      beforeEach(fakeAsync(() => {
        store.reset();
        router.navigate(['/compare']);
        tick(5000);
      }));

      it('should not load anything additionally when going to compare page', fakeAsync(() => {
        expect(getCategoryIds(store.state)).toBeEmpty();
        expect(getProductIds(store.state)).toEqual(['P1']);
      }));

      it('should trigger actions for deselecting category and product when no longer in category or product', fakeAsync(() => {
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          @ngrx/router-store/request:
            routerState: {"url":"/product/P1","params":{"sku":"P1"},"queryParams":{},...
            event: {"id":2,"url":"/compare"}
          @ngrx/router-store/navigation:
            routerState: {"url":"/compare","params":{},"queryParams":{},"data":{},"pa...
            event: {"id":2,"url":"/compare"}
          @ngrx/router-store/navigated:
            routerState: {"url":"/compare","params":{},"queryParams":{},"data":{},"pa...
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
      expect(getCategoryIds(store.state)).toMatchInlineSnapshot(`
        Array [
          "A.123.456",
          "A",
          "A.123",
        ]
      `);
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
        [Categories Internal] Load Category:
          categoryId: "A.123.456"
        [Products Internal] Load Product:
          sku: "P3"
        [Categories API] Load Category Success:
          categories: tree(A.123.456)
        [Products API] Load Product Fail:
          error: {"name":"HttpErrorResponse","message":"error loading product...
          sku: "P3"
        [Categories Internal] Load Category:
          categoryId: "A"
        [Categories Internal] Load Category:
          categoryId: "A.123"
        @ngrx/router-store/cancel:
          routerState: {"url":"","params":{},"queryParams":{},"data":{}}
          storeState: {"configuration":{"locales":[3],"_deviceType":"mobile"},"sho...
          event: {"id":1,"url":"/category/A.123.456/product/P3"}
        @ngrx/router-store/request:
          routerState: {"url":"","params":{},"queryParams":{},"data":{}}
          event: {"id":2,"url":"/error"}
        [Categories API] Load Category Success:
          categories: tree(A,A.123)
        [Categories API] Load Category Success:
          categories: tree(A.123,A.123.456)
        @ngrx/router-store/navigation:
          routerState: {"url":"/error","params":{},"queryParams":{},"data":{"header...
          event: {"id":2,"url":"/error"}
        @ngrx/router-store/navigated:
          routerState: {"url":"/error","params":{},"queryParams":{},"data":{"header...
          event: {"id":2,"url":"/error"}
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
      expect(getCategoryIds(store.state)).toBeEmpty();
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
        [Categories Internal] Load Category:
          categoryId: "A.123.XXX"
        [Categories API] Load Category Fail:
          error: {"name":"HttpErrorResponse","message":"error loading categor...
        @ngrx/router-store/cancel:
          routerState: {"url":"","params":{},"queryParams":{},"data":{}}
          storeState: {"configuration":{"locales":[3],"_deviceType":"mobile"},"sho...
          event: {"id":1,"url":"/category/A.123.XXX"}
        @ngrx/router-store/request:
          routerState: {"url":"","params":{},"queryParams":{},"data":{}}
          event: {"id":2,"url":"/error"}
        @ngrx/router-store/navigation:
          routerState: {"url":"/error","params":{},"queryParams":{},"data":{"header...
          event: {"id":2,"url":"/error"}
        @ngrx/router-store/navigated:
          routerState: {"url":"/error","params":{},"queryParams":{},"data":{"header...
          event: {"id":2,"url":"/error"}
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
        @ngrx/router-store/navigated:
          routerState: {"url":"/search/something","params":{"searchTerm":"something...
          event: {"id":1,"url":"/search/something"}
        [Product Listing] Load More Products:
          id: {"type":"search","value":"something"}
        [Viewconf Internal] Set Breadcrumb Data:
          breadcrumbData: [{"text":"search.breadcrumbs.your_search.label something"}]
        [Product Listing Internal] Load More Products For Params:
          id: {"type":"search","value":"something"}
          filters: undefined
          sorting: undefined
          page: undefined
        [Search Internal] Search Products:
          searchTerm: "something"
          page: undefined
          sorting: undefined
        [Filter Internal] Load Filter for Search:
          searchTerm: "something"
        [Products API] Load Product Success:
          product: {"sku":"P2"}
        [Product Listing Internal] Set Product Listing Pages:
          1: ["P2"]
          id: {"type":"search","value":"something"}
          itemCount: 1
          sortKeys: []
        [Filter API] Load Filter Success:
          filterNavigation: {}
      `);
    }));
  });
});
