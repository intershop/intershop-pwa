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
import { MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH } from '../../core/configurations/injection-keys';
import { CountryService } from '../../core/services/countries/country.service';
import { coreEffects, coreReducers } from '../../core/store/core.system';
import { Category } from '../../models/category/category.model';
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

fdescribe('Shopping Store', () => {
  let store: LogEffects;
  let router: Router;
  let categoriesServiceMock: CategoriesService;
  let productsServiceMock: ProductsService;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    categoriesServiceMock = mock(CategoriesService);
    when(categoriesServiceMock.getTopLevelCategories(anyNumber())).thenReturn(
      of([
        {
          uniqueId: '123',
          id: '123',
          hasOnlineSubCategories: true,
          hasOnlineProducts: false,
        },
      ] as Category[])
    );
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
    when(productsServiceMock.getCategoryProducts('123.456', anything())).thenReturn(
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
        { provide: MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH, useValue: 0 },
      ],
    });

    store = TestBed.get(LogEffects);
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
      })
    );
  });

  describe('category page', () => {
    beforeEach(
      fakeAsync(() => {
        router.navigate(['/category', '123']);
        tick(5000);
      })
    );

    it(
      'should load necessary data when going to a category page',
      fakeAsync(() => {
        const i = store.actionsIterator(['[Shopping]', '[Router]']);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategories);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategoriesSuccess);
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
    beforeEach(
      fakeAsync(() => {
        router.navigate(['/category', '123.456']);
        tick(5000);
      })
    );

    it(
      'should load all products when going to a family page',
      fakeAsync(() => {
        const i = store.actionsIterator(['[Shopping]']);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategories);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategoriesSuccess);
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

        expect(getCategoriesIds(store.state)).toEqual(['123', '123.456']);
        expect(getProductIds(store.state)).toEqual(['P1', 'P2']);
      })
    );

    describe('and clicking a product', () => {
      beforeEach(
        fakeAsync(() => {
          store.actions = [];
          router.navigate(['/category', '123.456', 'product', 'P1']);
          tick(5000);
        })
      );

      it(
        'should reload the product selected',
        fakeAsync(() => {
          const i = store.actionsIterator(['[Shopping]']);
          expect(i.next()).toEqual(new SelectProduct('P1'));
          expect(i.next().type).toEqual(RecentlyActionTypes.AddToRecently);
          expect(i.next()).toEqual(new LoadProduct('P1'));
          expect(i.next().type).toEqual(ProductsActionTypes.LoadProductSuccess);
          expect(i.next()).toBeUndefined();
        })
      );
    });
  });

  describe('product page', () => {
    it(
      'should load the product and its required category when going to a product page',
      fakeAsync(() => {
        router.navigate(['/category', '123.456', 'product', 'P1']);

        tick(5000);
        expect(store.actions).toBeTruthy();
        const i = store.actionsIterator(['[Shopping]']);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategories);
        expect(i.next().type).toEqual(CategoriesActionTypes.LoadTopLevelCategoriesSuccess);
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

        expect(getCategoriesIds(store.state)).toEqual(['123', '123.456']);
        expect(getProductIds(store.state)).toEqual(['P1']);
      })
    );
  });
});
