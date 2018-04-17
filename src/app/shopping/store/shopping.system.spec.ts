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
import { Scheduler } from 'rxjs/Scheduler';
import { anyNumber, anyString, anything, instance, mock, when } from 'ts-mockito/lib/ts-mockito';
import { AccountLoginService } from '../../core/services/account-login/account-login.service';
import { CategoriesService } from '../../core/services/categories/categories.service';
import { CountryService } from '../../core/services/countries/country.service';
import { SuggestService } from '../../core/services/suggest/suggest.service';
import { coreEffects, coreReducers } from '../../core/store/core.system';
import { Category } from '../../models/category/category.model';
import { LogEffects } from '../../utils/dev/log.effects';
import { ProductsService } from '../services/products/products.service';
import { SearchService } from '../services/products/search.service';
import { CategoriesActionTypes, getCategoriesIds, LoadCategory, SelectCategory } from './categories';
import { getProductIds, LoadProduct, ProductsActionTypes, SelectProduct } from './products';
import { RecentlyActionTypes } from './recently';
import { shoppingEffects, shoppingReducers } from './shopping.system';
import { ViewconfActionTypes } from './viewconf';

describe('Shopping Store', () => {
  let store: LogEffects;
  let router: Router;
  let categoriesServiceMock: CategoriesService;
  let productsServiceMock: ProductsService;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    categoriesServiceMock = mock(CategoriesService);
    when(categoriesServiceMock.getTopLevelCategories(anyNumber())).thenReturn(empty());
    when(categoriesServiceMock.getCategory(anyString())).thenReturn(empty());
    when(categoriesServiceMock.getCategory('123')).thenReturn(
      of(<Category>{
        uniqueId: '123',
        id: '123',
        hasOnlineSubCategories: true,
        hasOnlineProducts: false,
      })
    );
    when(categoriesServiceMock.getCategory('123.456')).thenReturn(
      of(<Category>{
        uniqueId: '123.456',
        id: '456',
        hasOnlineSubCategories: false,
        hasOnlineProducts: true,
      })
    );

    const countryServiceMock = mock(CountryService);
    when(countryServiceMock.getCountries()).thenReturn(empty());

    productsServiceMock = mock(ProductsService);
    when(productsServiceMock.getProduct(anyString())).thenCall(sku => of({ sku }));
    when(productsServiceMock.getProductsSkusForCategory('123.456', anything())).thenReturn(
      of({
        skus: ['P1', 'P2'],
        categoryUniqueId: '123.456',
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
        { provide: AccountLoginService, useFactory: () => instance(mock(AccountLoginService)) },
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
        { provide: CountryService, useFactory: () => instance(countryServiceMock) },
        { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
        { provide: SearchService, useFactory: () => instance(mock(SearchService)) },
        { provide: SuggestService, useFactory: () => instance(mock(SuggestService)) },
        { provide: Scheduler, useFactory: getTestScheduler },
      ],
    });

    store = TestBed.get(LogEffects);
    router = TestBed.get(Router);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('category page', () => {
    it(
      'should load necessary data when going to a category page',
      fakeAsync(() => {
        router.navigate(['/category', '123']);

        tick(5000);
        expect(store.actions).toBeTruthy();

        const i = store.actionsIterator(['[Shopping]', '[Router]']);
        expect(i.next().type).toEqual(ROUTER_NAVIGATION_TYPE);
        expect(i.next()).toEqual(new SelectCategory('123'));
        expect(i.next()).toEqual(new LoadCategory('123'));
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);
        expect(i.next()).toBeUndefined();

        expect(getCategoriesIds(store.state)).toEqual(['123']);
      })
    );
  });

  describe('family page', () => {
    it(
      'should load all products when going to a family page',
      fakeAsync(() => {
        router.navigate(['/category', '123.456']);

        tick(5000);
        expect(store.actions).toBeTruthy();
        const i = store.actionsIterator(['[Shopping]']);
        expect(i.next()).toEqual(new SelectCategory('123.456'));
        expect(i.next()).toEqual(new LoadCategory('123.456'));
        expect(i.next()).toEqual(new LoadCategory('123'));
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);
        expect(i.next().type).toEqual(ProductsActionTypes.LoadProductsForCategory);
        expect(i.next().type).toEqual(CategoriesActionTypes.SetProductSkusForCategory);
        expect(i.next().type).toEqual(ViewconfActionTypes.SetSortKeys);
        expect(i.next()).toEqual(new LoadProduct('P1'));
        expect(i.next()).toEqual(new LoadProduct('P2'));
        expect(i.next().type).toEqual(ProductsActionTypes.LoadProductSuccess);
        expect(i.next().type).toEqual(ProductsActionTypes.LoadProductSuccess);
        expect(i.next()).toBeUndefined();

        expect(getCategoriesIds(store.state)).toEqual(['123.456', '123']);
        expect(getProductIds(store.state)).toEqual(['P1', 'P2']);
      })
    );
  });

  describe('product page', () => {
    it(
      'should load the product and its required category when going to a product page',
      fakeAsync(() => {
        router.navigate(['/category', '123.456', 'product', 'P1']);

        tick(5000);
        expect(store.actions).toBeTruthy();
        expect(store.actions.length).toEqual(13);
        const i = store.actionsIterator(['[Shopping]']);
        expect(i.next()).toEqual(new SelectCategory('123.456'));
        expect(i.next()).toEqual(new SelectProduct('P1'));
        expect(i.next()).toEqual(new LoadCategory('123.456'));
        expect(i.next()).toEqual(new LoadCategory('123'));
        expect(i.next().type).toEqual(RecentlyActionTypes.AddToRecently);
        expect(i.next()).toEqual(new LoadProduct('P1'));
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadCategorySuccess);
        expect(i.next().type).toEqual(ProductsActionTypes.LoadProductSuccess);
        expect(i.next()).toBeUndefined();

        expect(getCategoriesIds(store.state)).toEqual(['123.456', '123']);
        expect(getProductIds(store.state)).toEqual(['P1']);
      })
    );
  });
});
