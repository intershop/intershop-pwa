// tslint:disable use-component-change-detection prefer-mocks-instead-of-stubs-in-tests
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
  ENDLESS_SCROLLING_ITEMS_PER_PAGE,
  LARGE_BREAKPOINT_WIDTH,
  MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH,
  MEDIUM_BREAKPOINT_WIDTH,
} from 'ish-core/configurations/injection-keys';
import { Category, CategoryCompletenessLevel } from 'ish-core/models/category/category.model';
import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { Locale } from 'ish-core/models/locale/locale.model';
import { Product } from 'ish-core/models/product/product.model';
import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { AddressService } from 'ish-core/services/address/address.service';
import { CategoriesService } from 'ish-core/services/categories/categories.service';
import { CountryService } from 'ish-core/services/country/country.service';
import { FilterService } from 'ish-core/services/filter/filter.service';
import { OrderService } from 'ish-core/services/order/order.service';
import { PersonalizationService } from 'ish-core/services/personalization/personalization.service';
import { ProductsService } from 'ish-core/services/products/products.service';
import { PromotionsService } from 'ish-core/services/promotions/promotions.service';
import { SuggestService } from 'ish-core/services/suggest/suggest.service';
import { UserService } from 'ish-core/services/user/user.service';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';
import { coreEffects, coreReducers } from '../core-store.module';

import { getCategoryIds, getSelectedCategory } from './categories';
import { getProductIds, getSelectedProduct } from './products';
import { getRecentlyViewedProducts } from './recently';
import { SuggestSearch } from './search';
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
        sortKeys: [],
        products: [{ sku: 'P1' }, { sku: 'P2' }] as Product[],
        total: 2,
      })
    );
    when(productsServiceMock.searchProducts('something', anyNumber(), anyNumber())).thenReturn(
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
        ...ngrxTesting(
          {
            ...coreReducers,
            shopping: combineReducers(shoppingReducers),
          },
          [...coreEffects, ...shoppingEffects]
        ),
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
      ],
      providers: [
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
        { provide: CountryService, useFactory: () => instance(countryServiceMock) },
        { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
        { provide: PromotionsService, useFactory: () => instance(promotionsServiceMock) },
        { provide: OrderService, useFactory: () => instance(mock(OrderService)) },
        { provide: UserService, useFactory: () => instance(mock(UserService)) },
        { provide: PersonalizationService, useFactory: () => instance(mock(PersonalizationService)) },
        { provide: AddressService, useFactory: () => instance(mock(AddressService)) },
        { provide: SuggestService, useFactory: () => instance(suggestServiceMock) },
        { provide: FilterService, useFactory: () => instance(filterServiceMock) },
        { provide: MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH, useValue: 1 },
        { provide: AVAILABLE_LOCALES, useValue: locales },
        { provide: ENDLESS_SCROLLING_ITEMS_PER_PAGE, useValue: 3 },
        { provide: MEDIUM_BREAKPOINT_WIDTH, useValue: 768 },
        { provide: LARGE_BREAKPOINT_WIDTH, useValue: 992 },
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
        [Router] Navigation:
          params: {}
          queryParams: {}
          data: {}
          path: "home"
        [Locale] Set Available Locales:
          locales: [{"lang":"en_US","currency":"USD","value":"en"},{"lang":"de_...
        [Viewconf Internal] Set Device Type:
          deviceType: "pc"
        [Viewconf Internal] Set Breadcrumb Data:
          breadcrumbData: undefined
        [Shopping] Load top level categories:
          depth: 1
        [Shopping Internal] Set Endless Scrolling Page Size:
          itemsPerPage: 3
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
          [Router] Navigation:
            params: {"categoryUniqueId":"A.123"}
            queryParams: {}
            data: {}
            path: "category/:categoryUniqueId"
          [Shopping] Select Category:
            categoryId: "A.123"
          [Shopping] Load Category:
            categoryId: "A.123"
          [Shopping] Load Category Success:
            categories: tree(A.123,A.123.456)
          [Shopping] Selected Category Available:
            categoryId: "A.123"
          [Shopping] Load Category:
            categoryId: "A"
          [Shopping] Load Filter For Category:
            category: {"uniqueId":"A.123","categoryPath":[2],"completenessLevel":3}
          [Shopping] Load Category Success:
            categories: tree(A,A.123)
          [Shopping] Load Filter For Category Success:
            filterNavigation: {}
        `);
      }));
    });

    describe('and looking for suggestions', () => {
      beforeEach(fakeAsync(() => {
        store.reset();
        store.dispatch(new SuggestSearch({ searchTerm: 'some' }));
        tick(5000);
      }));

      it('should trigger suggest actions when suggest feature is used', () => {
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          [Shopping] Suggest Search:
            searchTerm: "some"
          [Shopping] Suggest Search Success:
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
          [Router] Navigation:
            params: {"searchTerm":"something"}
            queryParams: {}
            data: {}
            path: "search/:searchTerm"
          [Shopping] Prepare Search For Products
          [Shopping] Search Products:
            searchTerm: "something"
          [Shopping] Search Products Success:
            searchTerm: "something"
          [Shopping] Set Paging Info:
            currentPage: 0
            totalItems: 1
            newProducts: ["P2"]
          [Shopping] Load Product Success:
            product: {"sku":"P2"}
          [Shopping] Set SortKey List:
            sortKeys: []
          [Shopping] Load Filter for Search:
            searchTerm: "something"
          [Shopping] Load Filter for Search Success:
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
            [Router] Navigation:
              params: {"sku":"P2"}
              queryParams: {}
              data: {}
              path: "product/:sku"
            [Shopping] Select Product:
              sku: "P2"
            [Shopping] Load Product:
              sku: "P2"
            [Recently Viewed] Add Product to Recently:
              sku: "P2"
            [Shopping] Load Product Success:
              product: {"sku":"P2"}
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
        [Router] Navigation:
          params: {"categoryUniqueId":"A.123"}
          queryParams: {}
          data: {}
          path: "category/:categoryUniqueId"
        [Locale] Set Available Locales:
          locales: [{"lang":"en_US","currency":"USD","value":"en"},{"lang":"de_...
        [Viewconf Internal] Set Device Type:
          deviceType: "pc"
        [Viewconf Internal] Set Breadcrumb Data:
          breadcrumbData: undefined
        [Shopping] Select Category:
          categoryId: "A.123"
        [Shopping] Load top level categories:
          depth: 1
        [Shopping Internal] Set Endless Scrolling Page Size:
          itemsPerPage: 3
        [Shopping] Load Category:
          categoryId: "A.123"
        [Shopping] Load top level categories success:
          categories: tree(A,A.123,B)
        [Shopping] Load Category Success:
          categories: tree(A.123,A.123.456)
        [Shopping] Selected Category Available:
          categoryId: "A.123"
        [Shopping] Load Category:
          categoryId: "A"
        [Shopping] Load Filter For Category:
          category: {"uniqueId":"A.123","categoryPath":[2],"completenessLevel":3}
        [Shopping] Load Category Success:
          categories: tree(A,A.123)
        [Shopping] Load Filter For Category Success:
          filterNavigation: {}
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
          [Router] Navigation:
            params: {}
            queryParams: {}
            data: {}
            path: "compare"
          [Shopping] Deselect Category
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
        [Router] Navigation:
          params: {"categoryUniqueId":"A.123.456"}
          queryParams: {}
          data: {}
          path: "category/:categoryUniqueId"
        [Locale] Set Available Locales:
          locales: [{"lang":"en_US","currency":"USD","value":"en"},{"lang":"de_...
        [Viewconf Internal] Set Device Type:
          deviceType: "pc"
        [Viewconf Internal] Set Breadcrumb Data:
          breadcrumbData: undefined
        [Shopping] Select Category:
          categoryId: "A.123.456"
        [Shopping] Load top level categories:
          depth: 1
        [Shopping Internal] Set Endless Scrolling Page Size:
          itemsPerPage: 3
        [Shopping] Load Category:
          categoryId: "A.123.456"
        [Shopping] Load top level categories success:
          categories: tree(A,A.123,B)
        [Shopping] Load Category Success:
          categories: tree(A.123.456)
        [Shopping] Selected Category Available:
          categoryId: "A.123.456"
        [Shopping] Load Products for Category:
          categoryId: "A.123.456"
        [Shopping] Load Category:
          categoryId: "A"
        [Shopping] Load Category:
          categoryId: "A.123"
        [Shopping] Load Filter For Category:
          category: {"uniqueId":"A.123.456","categoryPath":[3],"hasOnlineProduct...
        [Shopping] Load Product Success:
          product: {"sku":"P1"}
        [Shopping] Load Product Success:
          product: {"sku":"P2"}
        [Shopping] Set Paging Info:
          currentPage: 0
          totalItems: 2
          newProducts: ["P1","P2"]
        [Shopping] Set SortKey List:
          sortKeys: []
        [Shopping] Load Category Success:
          categories: tree(A,A.123)
        [Shopping] Load Category Success:
          categories: tree(A.123,A.123.456)
        [Shopping] Load Filter For Category Success:
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
          [Router] Navigation:
            params: {"categoryUniqueId":"A.123.456","sku":"P1"}
            queryParams: {}
            data: {}
            path: "category/:categoryUniqueId/product/:sku"
          [Shopping] Select Product:
            sku: "P1"
          [Shopping] Load Product:
            sku: "P1"
          [Recently Viewed] Add Product to Recently:
            sku: "P1"
          [Shopping] Load Product Success:
            product: {"sku":"P1"}
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
            [Router] Navigation:
              params: {"categoryUniqueId":"A.123.456"}
              queryParams: {}
              data: {}
              path: "category/:categoryUniqueId"
            [Shopping] Select Product:
              sku: undefined
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
          [Router] Navigation:
            params: {}
            queryParams: {}
            data: {}
            path: "compare"
          [Shopping] Deselect Category
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
        [Router] Navigation:
          params: {"categoryUniqueId":"A.123.456","sku":"P1"}
          queryParams: {}
          data: {}
          path: "category/:categoryUniqueId/product/:sku"
        [Locale] Set Available Locales:
          locales: [{"lang":"en_US","currency":"USD","value":"en"},{"lang":"de_...
        [Viewconf Internal] Set Device Type:
          deviceType: "pc"
        [Viewconf Internal] Set Breadcrumb Data:
          breadcrumbData: undefined
        [Shopping] Select Category:
          categoryId: "A.123.456"
        [Shopping] Load top level categories:
          depth: 1
        [Shopping] Select Product:
          sku: "P1"
        [Shopping Internal] Set Endless Scrolling Page Size:
          itemsPerPage: 3
        [Shopping] Load Category:
          categoryId: "A.123.456"
        [Shopping] Load top level categories success:
          categories: tree(A,A.123,B)
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
        [Shopping] Load Category:
          categoryId: "A"
        [Shopping] Load Category:
          categoryId: "A.123"
        [Shopping] Load Filter For Category:
          category: {"uniqueId":"A.123.456","categoryPath":[3],"hasOnlineProduct...
        [Shopping] Load Category Success:
          categories: tree(A,A.123)
        [Shopping] Load Category Success:
          categories: tree(A.123,A.123.456)
        [Shopping] Load Filter For Category Success:
          filterNavigation: {}
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
          [Router] Navigation:
            params: {"categoryUniqueId":"A.123.456"}
            queryParams: {}
            data: {}
            path: "category/:categoryUniqueId"
          [Shopping] Load Products for Category:
            categoryId: "A.123.456"
          [Shopping] Select Product:
            sku: undefined
          [Shopping] Load Product Success:
            product: {"sku":"P1"}
          [Shopping] Load Product Success:
            product: {"sku":"P2"}
          [Shopping] Set Paging Info:
            currentPage: 0
            totalItems: 2
            newProducts: ["P1","P2"]
          [Shopping] Set SortKey List:
            sortKeys: []
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
          [Router] Navigation:
            params: {}
            queryParams: {}
            data: {}
            path: "compare"
          [Shopping] Deselect Category
          [Shopping] Select Product:
            sku: undefined
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
        [Router] Navigation:
          params: {"sku":"P1"}
          queryParams: {}
          data: {}
          path: "product/:sku"
        [Locale] Set Available Locales:
          locales: [{"lang":"en_US","currency":"USD","value":"en"},{"lang":"de_...
        [Viewconf Internal] Set Device Type:
          deviceType: "pc"
        [Viewconf Internal] Set Breadcrumb Data:
          breadcrumbData: undefined
        [Shopping] Load top level categories:
          depth: 1
        [Shopping] Select Product:
          sku: "P1"
        [Shopping Internal] Set Endless Scrolling Page Size:
          itemsPerPage: 3
        [Shopping] Load top level categories success:
          categories: tree(A,A.123,B)
        [Shopping] Load Product:
          sku: "P1"
        [Shopping] Load Product Success:
          product: {"sku":"P1"}
        [Recently Viewed] Add Product to Recently:
          sku: "P1"
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
          [Router] Navigation:
            params: {}
            queryParams: {}
            data: {}
            path: "compare"
          [Shopping] Select Product:
            sku: undefined
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
        [Router] Navigation:
          params: {"categoryUniqueId":"A.123.456","sku":"P3"}
          queryParams: {}
          data: {}
          path: "category/:categoryUniqueId/product/:sku"
        [Locale] Set Available Locales:
          locales: [{"lang":"en_US","currency":"USD","value":"en"},{"lang":"de_...
        [Viewconf Internal] Set Device Type:
          deviceType: "pc"
        [Viewconf Internal] Set Breadcrumb Data:
          breadcrumbData: undefined
        [Shopping] Select Category:
          categoryId: "A.123.456"
        [Shopping] Load top level categories:
          depth: 1
        [Shopping] Select Product:
          sku: "P3"
        [Shopping Internal] Set Endless Scrolling Page Size:
          itemsPerPage: 3
        [Shopping] Load Category:
          categoryId: "A.123.456"
        [Shopping] Load top level categories success:
          categories: tree(A,A.123,B)
        [Shopping] Load Product:
          sku: "P3"
        [Shopping] Load Category Success:
          categories: tree(A.123.456)
        [Shopping] Load Product Fail:
          error: {"message":"error loading product P3"}
          sku: "P3"
        [Shopping] Selected Category Available:
          categoryId: "A.123.456"
        [Shopping] Load Category:
          categoryId: "A"
        [Shopping] Load Category:
          categoryId: "A.123"
        [Shopping] Load Filter For Category:
          category: {"uniqueId":"A.123.456","categoryPath":[3],"hasOnlineProduct...
        [Shopping] Load Category Success:
          categories: tree(A,A.123)
        [Shopping] Load Category Success:
          categories: tree(A.123,A.123.456)
        [Shopping] Load Filter For Category Success:
          filterNavigation: {}
        [Router] Navigation:
          params: {}
          queryParams: {}
          data: {}
          path: "error"
        [Shopping] Deselect Category
        [Shopping] Select Product:
          sku: undefined
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
        [Router] Navigation:
          params: {"categoryUniqueId":"A.123.XXX"}
          queryParams: {}
          data: {}
          path: "category/:categoryUniqueId"
        [Locale] Set Available Locales:
          locales: [{"lang":"en_US","currency":"USD","value":"en"},{"lang":"de_...
        [Viewconf Internal] Set Device Type:
          deviceType: "pc"
        [Viewconf Internal] Set Breadcrumb Data:
          breadcrumbData: undefined
        [Shopping] Select Category:
          categoryId: "A.123.XXX"
        [Shopping] Load top level categories:
          depth: 1
        [Shopping Internal] Set Endless Scrolling Page Size:
          itemsPerPage: 3
        [Shopping] Load Category:
          categoryId: "A.123.XXX"
        [Shopping] Load top level categories success:
          categories: tree(A,A.123,B)
        [Shopping] Load Category Fail:
          error: {"message":"error loading category A.123.XXX"}
        [Router] Navigation:
          params: {}
          queryParams: {}
          data: {}
          path: "error"
        [Shopping] Deselect Category
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
        [Router] Navigation:
          params: {"searchTerm":"something"}
          queryParams: {}
          data: {}
          path: "search/:searchTerm"
        [Locale] Set Available Locales:
          locales: [{"lang":"en_US","currency":"USD","value":"en"},{"lang":"de_...
        [Viewconf Internal] Set Device Type:
          deviceType: "pc"
        [Viewconf Internal] Set Breadcrumb Data:
          breadcrumbData: undefined
        [Shopping] Load top level categories:
          depth: 1
        [Shopping Internal] Set Endless Scrolling Page Size:
          itemsPerPage: 3
        [Shopping] Load top level categories success:
          categories: tree(A,A.123,B)
        [Shopping] Prepare Search For Products
        [Shopping] Search Products:
          searchTerm: "something"
        [Shopping] Search Products Success:
          searchTerm: "something"
        [Shopping] Set Paging Info:
          currentPage: 0
          totalItems: 1
          newProducts: ["P2"]
        [Shopping] Load Product Success:
          product: {"sku":"P2"}
        [Shopping] Set SortKey List:
          sortKeys: []
        [Shopping] Load Filter for Search:
          searchTerm: "something"
        [Shopping] Load Filter for Search Success:
          filterNavigation: {}
      `);
    }));
  });
});
