import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { createSelector } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { EMPTY, of, throwError } from 'rxjs';
import { anyNumber, anyString, anything, instance, mock, when } from 'ts-mockito';

import { SelectedProductContextFacade } from 'ish-core/facades/selected-product-context.facade';
import { Category, CategoryCompletenessLevel } from 'ish-core/models/category/category.model';
import { FilterNavigation } from 'ish-core/models/filter-navigation/filter-navigation.model';
import { Product } from 'ish-core/models/product/product.model';
import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { CategoriesService } from 'ish-core/services/categories/categories.service';
import { ConfigurationService } from 'ish-core/services/configuration/configuration.service';
import { CountryService } from 'ish-core/services/country/country.service';
import { FilterService } from 'ish-core/services/filter/filter.service';
import { PricesService } from 'ish-core/services/prices/prices.service';
import { ProductsService } from 'ish-core/services/products/products.service';
import { PromotionsService } from 'ish-core/services/promotions/promotions.service';
import { SuggestService } from 'ish-core/services/suggest/suggest.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { personalizationStatusDetermined } from 'ish-core/store/customer/user';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import { getCategoryTree, getSelectedCategory } from './categories';
import { setProductListingPageSize } from './product-listing';
import { getProductEntities, getSelectedProduct } from './products';
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
  let priceServiceMock: PricesService;

  beforeEach(() => {
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
              { ...catA, completenessLevel: 0 },
              { ...catA123, completenessLevel: CategoryCompletenessLevel.Max },
              { ...catA123456, completenessLevel: 1 },
            ])
          );
        case 'A.123.456':
          return of(
            categoryTree([
              { ...catA, completenessLevel: 0 },
              { ...catA123, completenessLevel: 0 },
              { ...catA123456, completenessLevel: CategoryCompletenessLevel.Max },
            ])
          );
        default:
          return throwError(() => makeHttpError({ message: `error loading category ${uniqueId}` }));
      }
    });

    const configurationServiceMock = mock(ConfigurationService);
    when(configurationServiceMock.getServerConfiguration()).thenReturn(EMPTY);

    const countryServiceMock = mock(CountryService);
    when(countryServiceMock.getCountries()).thenReturn(EMPTY);

    productsServiceMock = mock(ProductsService);
    when(productsServiceMock.getProduct(anyString())).thenCall(sku => {
      if (['P1', 'P2'].find(x => x === sku)) {
        return of({ sku, name: `n${sku}` });
      } else {
        return throwError(() => makeHttpError({ message: `error loading product ${sku}` }));
      }
    });
    when(productsServiceMock.getCategoryProducts('A.123.456', anyNumber(), anything(), anyNumber())).thenReturn(
      of({
        sortableAttributes: [],
        products: [{ sku: 'P1' }, { sku: 'P2' }] as Product[],
        total: 2,
      })
    );
    when(productsServiceMock.searchProducts('something', anyNumber(), anything(), anyNumber())).thenReturn(
      of({ products: [{ sku: 'P1' }, { sku: 'P2' }] as Product[], sortableAttributes: [], total: 2 })
    );

    promotionsServiceMock = mock(PromotionsService);
    when(promotionsServiceMock.getPromotion(anything())).thenReturn(of(promotion));

    suggestServiceMock = mock(SuggestService);
    when(suggestServiceMock.search('some')).thenReturn(of([{ term: 'something' }]));

    filterServiceMock = mock(FilterService);
    when(filterServiceMock.getFilterForSearch(anything())).thenReturn(of({} as FilterNavigation));
    when(filterServiceMock.getFilterForCategory(anything())).thenReturn(of({} as FilterNavigation));

    priceServiceMock = mock(PricesService);
    when(priceServiceMock.getProductPrices(anything())).thenReturn(of([]));

    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['router', 'configuration', 'serverConfig'], true),
        RouterTestingModule.withRoutes([
          {
            path: 'home',
            children: [],
          },
          {
            path: 'compare',
            children: [],
          },
          {
            path: 'error',
            children: [],
            data: { headerType: 'simple' },
          },
          {
            path: 'category/:categoryUniqueId',
            children: [],
          },
          {
            path: 'category/:categoryUniqueId/product/:sku',
            children: [],
          },
          {
            path: 'product/:sku',
            children: [],
          },
          {
            path: 'search/:searchTerm',
            children: [],
          },
        ]),
        ShoppingStoreModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
        { provide: FilterService, useFactory: () => instance(filterServiceMock) },
        { provide: PricesService, useFactory: () => instance(priceServiceMock) },
        { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
        { provide: PromotionsService, useFactory: () => instance(promotionsServiceMock) },
        { provide: SuggestService, useFactory: () => instance(suggestServiceMock) },
        provideStoreSnapshots(),
        SelectedProductContextFacade,
      ],
    });

    store = TestBed.inject(StoreWithSnapshots);
    store.dispatch(setProductListingPageSize({ itemsPerPage: 9 }));
    router = TestBed.inject(Router);
    TestBed.inject(SelectedProductContextFacade);
    store.reset();

    store.dispatch(personalizationStatusDetermined());
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
        [User Internal] Personalization Status Determined
        @ngrx/router-store/request: /home
        @ngrx/router-store/navigation: /home
        @ngrx/router-store/navigated: /home
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
            "A",
            "A.123",
            "A.123.456",
          ]
        `);
        expect(getProductIds(store.state)).toBeEmpty();
      }));

      it('should have toplevel loading and category loading actions when going to a category page', fakeAsync(() => {
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          @ngrx/router-store/request: /category/A.123
          @ngrx/router-store/navigation: /category/A.123
          [Categories Internal] Load Category:
            categoryId: "A.123"
          [Categories API] Load Category Success:
            categories: tree(A,A.123,A.123.456)
          [Viewconf Internal] Set Breadcrumb Data:
            breadcrumbData: [{"text":"nA","link":"/na-ctgA"},{"text":"nA123"}]
          @ngrx/router-store/navigated: /category/A.123
          [Viewconf Internal] Set Breadcrumb Data:
            breadcrumbData: [{"text":"nA","link":"/na-ctgA"},{"text":"nA123"}]
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

      it('should load the products for the search results', fakeAsync(() => {
        expect(getProductIds(store.state)).toEqual(['P1', 'P2']);
      }));

      it('should trigger required actions when searching', fakeAsync(() => {
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          @ngrx/router-store/request: /search/something
          @ngrx/router-store/navigation: /search/something
          [Viewconf Internal] Set Breadcrumb Data:
            breadcrumbData: [{"text":"search.breadcrumbs.your_search.label something"}]
          @ngrx/router-store/navigated: /search/something
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
            product: {"sku":"P1"}
          [Products API] Load Product Success:
            product: {"sku":"P2"}
          [Product Listing Internal] Set Product Listing Pages:
            1: ["P1","P2"]
            id: {"type":"search","value":"something"}
            itemCount: 2
            sortableAttributes: []
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
            @ngrx/router-store/request: /product/P2
            @ngrx/router-store/navigation: /product/P2
            [Products Internal] Load Product:
              sku: "P2"
            [Products API] Load Product Success:
              product: {"sku":"P2","name":"nP2"}
            @ngrx/router-store/navigated: /product/P2
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
          "A",
          "A.123",
          "A.123.456",
        ]
      `);
      expect(getProductIds(store.state)).toBeEmpty();
    }));

    it('should have toplevel loading and category loading actions when going to a category page', fakeAsync(() => {
      expect(store.actionsArray()).toMatchInlineSnapshot(`
        [User Internal] Personalization Status Determined
        @ngrx/router-store/request: /category/A.123
        @ngrx/router-store/navigation: /category/A.123
        [Categories Internal] Load Category:
          categoryId: "A.123"
        [Categories API] Load Category Success:
          categories: tree(A,A.123,A.123.456)
        @ngrx/router-store/navigated: /category/A.123
        [Viewconf Internal] Set Breadcrumb Data:
          breadcrumbData: [{"text":"nA","link":"/na-ctgA"},{"text":"nA123"}]
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
            "A",
            "A.123",
            "A.123.456",
          ]
        `);
        expect(getProductIds(store.state)).toBeEmpty();
      }));

      it('should trigger actions for deselecting category and product when no longer in category or product', fakeAsync(() => {
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          @ngrx/router-store/request: /compare
          @ngrx/router-store/navigation: /compare
          @ngrx/router-store/navigated: /compare
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
            "A",
            "A.123",
            "A.123.456",
          ]
        `);
      expect(getProductIds(store.state)).toEqual(['P1', 'P2']);
    }));

    it('should have all required actions when going to a family page', fakeAsync(() => {
      expect(store.actionsArray()).toMatchInlineSnapshot(`
        [User Internal] Personalization Status Determined
        @ngrx/router-store/request: /category/A.123.456
        @ngrx/router-store/navigation: /category/A.123.456
        [Categories Internal] Load Category:
          categoryId: "A.123.456"
        [Categories API] Load Category Success:
          categories: tree(A,A.123,A.123.456)
        @ngrx/router-store/navigated: /category/A.123.456
        [Product Listing] Load More Products:
          id: {"type":"category","value":"A.123.456"}
        [Viewconf Internal] Set Breadcrumb Data:
          breadcrumbData: [{"text":"nA","link":"/na-ctgA"},{"text":"nA123","link":"/na...
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
          sortableAttributes: []
        [Filter API] Load Filter Success:
          filterNavigation: {}
      `);
    }));

    describe('and clicking a product', () => {
      beforeEach(fakeAsync(() => {
        store.reset();
        router.navigate(['/category', 'A.123.456', 'product', 'P1']);
        tick(5000);
      }));

      it('should reload the product when selected', fakeAsync(() => {
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          @ngrx/router-store/request: /category/A.123.456/product/P1
          @ngrx/router-store/navigation: /category/A.123.456/product/P1
          [Products Internal] Load Product:
            sku: "P1"
          [Products API] Load Product Success:
            product: {"sku":"P1","name":"nP1"}
          @ngrx/router-store/navigated: /category/A.123.456/product/P1
        `);
      }));

      describe('and and going back to the family page', () => {
        beforeEach(fakeAsync(() => {
          store.reset();
          router.navigate(['/category', 'A.123.456']);
          tick(5000);
        }));

        it('should deselect product when navigating back', fakeAsync(() => {
          expect(store.actionsArray()).toMatchInlineSnapshot(`
            @ngrx/router-store/request: /category/A.123.456
            @ngrx/router-store/navigation: /category/A.123.456
            [Product Listing] Load More Products:
              id: {"type":"category","value":"A.123.456"}
            [Viewconf Internal] Set Breadcrumb Data:
              breadcrumbData: [{"text":"nA","link":"/na-ctgA"},{"text":"nA123","link":"/na...
            @ngrx/router-store/navigated: /category/A.123.456
            [Product Listing] Load More Products:
              id: {"type":"category","value":"A.123.456"}
            [Viewconf Internal] Set Breadcrumb Data:
              breadcrumbData: [{"text":"nA","link":"/na-ctgA"},{"text":"nA123","link":"/na...
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
          @ngrx/router-store/request: /search/something
          @ngrx/router-store/navigation: /search/something
          [Viewconf Internal] Set Breadcrumb Data:
            breadcrumbData: [{"text":"search.breadcrumbs.your_search.label something"}]
          @ngrx/router-store/navigated: /search/something
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
            product: {"sku":"P1"}
          [Products API] Load Product Success:
            product: {"sku":"P2"}
          [Product Listing Internal] Set Product Listing Pages:
            1: ["P1","P2"]
            id: {"type":"search","value":"something"}
            itemCount: 2
            sortableAttributes: []
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
            @ngrx/router-store/request: /category/A.123.456
            @ngrx/router-store/navigation: /category/A.123.456
            [Product Listing] Load More Products:
              id: {"type":"category","value":"A.123.456"}
            [Viewconf Internal] Set Breadcrumb Data:
              breadcrumbData: [{"text":"nA","link":"/na-ctgA"},{"text":"nA123","link":"/na...
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
              sortableAttributes: []
            [Filter API] Load Filter Success:
              filterNavigation: {}
            @ngrx/router-store/navigated: /category/A.123.456
            [Product Listing] Load More Products:
              id: {"type":"category","value":"A.123.456"}
            [Viewconf Internal] Set Breadcrumb Data:
              breadcrumbData: [{"text":"nA","link":"/na-ctgA"},{"text":"nA123","link":"/na...
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
            "A",
            "A.123",
            "A.123.456",
          ]
        `);
        expect(getProductIds(store.state)).toEqual(['P1', 'P2']);
      }));

      it('should trigger actions for deselecting category and product when no longer in category or product', fakeAsync(() => {
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          @ngrx/router-store/request: /compare
          @ngrx/router-store/navigation: /compare
          @ngrx/router-store/navigated: /compare
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
            "A",
            "A.123",
            "A.123.456",
          ]
        `);
      expect(getProductIds(store.state)).toEqual(['P1']);
    }));

    it('should trigger required load actions when going to a product page', fakeAsync(() => {
      expect(store.actionsArray()).toMatchInlineSnapshot(`
        [User Internal] Personalization Status Determined
        @ngrx/router-store/request: /category/A.123.456/product/P1
        @ngrx/router-store/navigation: /category/A.123.456/product/P1
        [Categories Internal] Load Category:
          categoryId: "A.123.456"
        [Categories API] Load Category Success:
          categories: tree(A,A.123,A.123.456)
        [Products Internal] Load Product:
          sku: "P1"
        [Products API] Load Product Success:
          product: {"sku":"P1","name":"nP1"}
        @ngrx/router-store/navigated: /category/A.123.456/product/P1
      `);
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
            "A",
            "A.123",
            "A.123.456",
          ]
        `);
        expect(getProductIds(store.state)).toEqual(['P1', 'P2']);
      }));

      it('should trigger actions for products when they are not yet loaded', fakeAsync(() => {
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          @ngrx/router-store/request: /category/A.123.456
          @ngrx/router-store/navigation: /category/A.123.456
          [Product Listing] Load More Products:
            id: {"type":"category","value":"A.123.456"}
          [Viewconf Internal] Set Breadcrumb Data:
            breadcrumbData: [{"text":"nA","link":"/na-ctgA"},{"text":"nA123","link":"/na...
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
            sortableAttributes: []
          [Filter API] Load Filter Success:
            filterNavigation: {}
          @ngrx/router-store/navigated: /category/A.123.456
          [Product Listing] Load More Products:
            id: {"type":"category","value":"A.123.456"}
          [Viewconf Internal] Set Breadcrumb Data:
            breadcrumbData: [{"text":"nA","link":"/na-ctgA"},{"text":"nA123","link":"/na...
        `);
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
            "A",
            "A.123",
            "A.123.456",
          ]
        `);
        expect(getProductIds(store.state)).toEqual(['P1']);
      }));

      it('should trigger actions for deselecting category and product when no longer in category or product', fakeAsync(() => {
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          @ngrx/router-store/request: /compare
          @ngrx/router-store/navigation: /compare
          @ngrx/router-store/navigated: /compare
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
        [User Internal] Personalization Status Determined
        @ngrx/router-store/request: /product/P1
        @ngrx/router-store/navigation: /product/P1
        [Products Internal] Load Product:
          sku: "P1"
        [Products API] Load Product Success:
          product: {"sku":"P1","name":"nP1"}
        @ngrx/router-store/navigated: /product/P1
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
          @ngrx/router-store/request: /compare
          @ngrx/router-store/navigation: /compare
          @ngrx/router-store/navigated: /compare
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
          "A",
          "A.123",
          "A.123.456",
        ]
      `);
      expect(getProductIds(store.state)).toBeEmpty();
    }));

    it('should trigger required load actions when going to a product page with invalid product sku', fakeAsync(() => {
      expect(store.actionsArray()).toMatchInlineSnapshot(`
        [User Internal] Personalization Status Determined
        @ngrx/router-store/request: /category/A.123.456/product/P3
        @ngrx/router-store/navigation: /category/A.123.456/product/P3
        [Categories Internal] Load Category:
          categoryId: "A.123.456"
        [Categories API] Load Category Success:
          categories: tree(A,A.123,A.123.456)
        [Products Internal] Load Product:
          sku: "P3"
        [Products API] Load Product Fail:
          error: {"name":"HttpErrorResponse","message":"error loading product...
          sku: "P3"
        @ngrx/router-store/cancel: /category/A.123.456/product/P3
        @ngrx/router-store/request: /error
        @ngrx/router-store/navigation: /error
        @ngrx/router-store/navigated: /error
      `);
    }));

    it('should not have a selected product or category when redirected to error page', fakeAsync(() => {
      expect(getSelectedCategory(store.state)).toBeUndefined();
      expect(getSelectedProduct(store.state)).toBeUndefined();
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
        [User Internal] Personalization Status Determined
        @ngrx/router-store/request: /category/A.123.XXX
        @ngrx/router-store/navigation: /category/A.123.XXX
        [Categories Internal] Load Category:
          categoryId: "A.123.XXX"
        [Categories API] Load Category Fail:
          error: {"name":"HttpErrorResponse","message":"error loading categor...
        @ngrx/router-store/cancel: /category/A.123.XXX
        @ngrx/router-store/request: /error
        @ngrx/router-store/navigation: /error
        @ngrx/router-store/navigated: /error
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

    it('should load the products for the search results', fakeAsync(() => {
      expect(getProductIds(store.state)).toEqual(['P1', 'P2']);
    }));

    it('should trigger required actions when searching', fakeAsync(() => {
      expect(store.actionsArray()).toMatchInlineSnapshot(`
        [User Internal] Personalization Status Determined
        @ngrx/router-store/request: /search/something
        @ngrx/router-store/navigation: /search/something
        @ngrx/router-store/navigated: /search/something
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
          product: {"sku":"P1"}
        [Products API] Load Product Success:
          product: {"sku":"P2"}
        [Product Listing Internal] Set Product Listing Pages:
          1: ["P1","P2"]
          id: {"type":"search","value":"something"}
          itemCount: 2
          sortableAttributes: []
        [Filter API] Load Filter Success:
          filterNavigation: {}
      `);
    }));
  });
});
