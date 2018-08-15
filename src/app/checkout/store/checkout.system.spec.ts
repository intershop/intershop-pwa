// tslint:disable use-component-change-detection prefer-mocks-instead-of-stubs-in-tests
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule, combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { anyNumber, anything, instance, mock, when } from 'ts-mockito';

import { OrderService } from '../../account/services/order/order.service';
import {
  AVAILABLE_LOCALES,
  ENDLESS_SCROLLING_ITEMS_PER_PAGE,
  MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH,
} from '../../core/configurations/injection-keys';
import { CountryService } from '../../core/services/countries/country.service';
import { coreEffects, coreReducers } from '../../core/store/core.system';
import { LoginUser } from '../../core/store/user';
import { Address } from '../../models/address/address.model';
import { BasketItem } from '../../models/basket-item/basket-item.model';
import { Basket } from '../../models/basket/basket.model';
import { LoginCredentials } from '../../models/credentials/credentials.model';
import { Customer } from '../../models/customer/customer.model';
import { Locale } from '../../models/locale/locale.model';
import { PaymentMethod } from '../../models/payment-method/payment-method.model';
import { Price } from '../../models/price/price.model';
import { RegistrationService } from '../../registration/services/registration/registration.service';
import { CategoriesService } from '../../shopping/services/categories/categories.service';
import { FilterService } from '../../shopping/services/filter/filter.service';
import { ProductsService } from '../../shopping/services/products/products.service';
import { SuggestService } from '../../shopping/services/suggest/suggest.service';
import { LoadProduct } from '../../shopping/store/products';
import { shoppingEffects, shoppingReducers } from '../../shopping/store/shopping.system';
import { LogEffects } from '../../utils/dev/log.effects';
import { categoryTree } from '../../utils/dev/test-data-utils';
import { AddressService } from '../services/address/address.service';
import { BasketService } from '../services/basket/basket.service';
import { AddItemsToBasket, AddProductToBasket, BasketActionTypes } from './basket';
import { checkoutEffects, checkoutReducers } from './checkout.system';

let basketId: string;

describe('Checkout System', () => {
  const DEBUG = false;
  let store: LogEffects;
  let locales: Locale[];

  const basket = {
    id: 'test',
    lineItems: [],
  } as Basket;

  const product = {
    name: 'test',
    shortDescription: 'test',
    longDescription: 'test',
    availability: true,
    inStock: true,
    minOrderQuantity: 1,
    attributes: [],
    images: [],
    listPrice: {} as Price,
    salePrice: {} as Price,
    manufacturer: 'test',
    readyForShipmentMin: 1,
    readyForShipmentMax: 1,
    sku: 'test',
    type: 0,
  };

  const lineItem = {
    id: 'test',
    name: 'test',
    position: 1,
    quantity: { type: 'test', value: 1 },
    productSKU: 'test',
    price: undefined,
    singleBasePrice: undefined,
    isHiddenGift: false,
    isFreeGift: false,
    inStock: false,
    variationProduct: false,
    bundleProduct: false,
    availability: false,
  } as BasketItem;

  const user = {
    type: 'PrivateCustomer',
    customerNo: 'test',
    preferredInvoiceToAddress: {} as Address,
    preferredShipToAddress: {} as Address,
    title: '',
    firstName: 'test',
    lastName: 'test',
    phoneHome: '',
    phoneBusiness: '',
    phoneMobile: '',
    fax: '',
    email: 'patricia@test.intershop.de',
    preferredLanguage: 'en_US',
    birthday: 'test',
  } as Customer;

  beforeEach(() => {
    @Component({ template: 'dummy' })
    class DummyComponent {}

    locales = [
      { lang: 'en_US', currency: 'USD', value: 'en' },
      { lang: 'de_DE', currency: 'EUR', value: 'de' },
      { lang: 'fr_FR', currency: 'EUR', value: 'fr' },
    ] as Locale[];

    const categoriesServiceMock = mock(CategoriesService);
    when(categoriesServiceMock.getTopLevelCategories(anyNumber())).thenReturn(of(categoryTree()));

    const countryServiceMock = mock(CountryService);
    when(countryServiceMock.getCountries()).thenReturn(of([{ countryCode: 'DE', name: 'Germany' }]));

    const basketServiceMock = mock(BasketService);
    when(basketServiceMock.getBasket(anything())).thenCall(() => {
      const newBasket = {
        ...basket,
      };

      if (basketId) {
        newBasket.id = basketId;
      }

      return of(newBasket);
    });
    when(basketServiceMock.getBasket()).thenCall(() => {
      const newBasket = {
        ...basket,
      };

      if (basketId) {
        newBasket.id = basketId;
      }

      return of(newBasket);
    });
    when(basketServiceMock.getBasketItems(anything())).thenReturn(of([lineItem]));
    when(basketServiceMock.addItemsToBasket(anything(), anything())).thenReturn(of(undefined));
    when(basketServiceMock.getBasketPayments(anything())).thenReturn(of([{ id: 'p_test' } as PaymentMethod]));

    const productsServiceMock = mock(ProductsService);
    when(productsServiceMock.getProduct(anything())).thenReturn(of(product));

    const registrationServiceMock = mock(RegistrationService);
    when(registrationServiceMock.signinUser(anything())).thenReturn(of(user));

    const filterServiceMock = mock(FilterService);
    const orderServiceMock = mock(OrderService);

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        StoreModule.forRoot({
          ...coreReducers,
          checkout: combineReducers(checkoutReducers),
          shopping: combineReducers(shoppingReducers),
        }),
        EffectsModule.forRoot([...coreEffects, ...checkoutEffects, ...shoppingEffects, LogEffects]),
        RouterTestingModule.withRoutes([
          {
            path: 'account',
            component: DummyComponent,
          },
        ]),
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: AddressService, useFactory: () => instance(mock(AddressService)) },
        { provide: BasketService, useFactory: () => instance(basketServiceMock) },
        { provide: OrderService, useFactory: () => instance(orderServiceMock) },
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
        { provide: CountryService, useFactory: () => instance(countryServiceMock) },
        { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
        { provide: RegistrationService, useFactory: () => instance(registrationServiceMock) },
        { provide: FilterService, useFactory: () => instance(filterServiceMock) },
        { provide: SuggestService, useFactory: () => instance(mock(SuggestService)) },
        { provide: MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH, useValue: 1 },
        { provide: AVAILABLE_LOCALES, useValue: locales },
        { provide: ENDLESS_SCROLLING_ITEMS_PER_PAGE, useValue: 3 },
      ],
    });

    store = TestBed.get(LogEffects);
    store.logActions = DEBUG;
    store.logState = DEBUG;
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('with anonymous user', () => {
    const payload = { sku: 'test', quantity: 1 };

    beforeEach(() => {
      store.dispatch(new LoadProduct('test'));
      store.dispatch(new AddProductToBasket(payload));
    });

    describe('and without basket', () => {
      it('should initially load basket and basketItems on product add.', () => {
        const i = store.actionsIterator([/Basket/]);
        expect(i.next().type).toEqual(BasketActionTypes.AddProductToBasket);
        expect(i.next()).toEqual(new AddItemsToBasket({ items: [payload] }));
        expect(i.next()).toEqual(new AddItemsToBasket({ items: [payload], basketId: 'test' }));
        expect(i.next().type).toEqual(BasketActionTypes.AddItemsToBasketSuccess);
        expect(i.next().type).toEqual(BasketActionTypes.LoadBasket);
        expect(i.next().type).toEqual(BasketActionTypes.LoadBasketSuccess);
        expect(i.next().type).toEqual(BasketActionTypes.LoadBasketItems);
        expect(i.next().type).toEqual(BasketActionTypes.LoadBasketPayments);
        expect(i.next().type).toEqual(BasketActionTypes.LoadBasketItemsSuccess);
        expect(i.next().type).toEqual(BasketActionTypes.LoadBasketPaymentsSuccess);
        expect(i.next()).toBeUndefined();
      });
    });

    describe('and with basket', () => {
      it('should merge basket on user login.', () => {
        const i = store.actionsIterator([/Basket/]);
        basketId = 'newTest';
        store.reset();

        store.dispatch(new LoginUser({} as LoginCredentials));
        expect(i.next()).toEqual(new AddItemsToBasket({ items: [payload], basketId: 'newTest' }));
        expect(i.next().type).toEqual(BasketActionTypes.AddItemsToBasketSuccess);
        expect(i.next().type).toEqual(BasketActionTypes.LoadBasket);
        expect(i.next().type).toEqual(BasketActionTypes.LoadBasketSuccess);
        expect(i.next().type).toEqual(BasketActionTypes.LoadBasketItems);
        expect(i.next().type).toEqual(BasketActionTypes.LoadBasketPayments);
        expect(i.next().type).toEqual(BasketActionTypes.LoadBasketItemsSuccess);
        expect(i.next().type).toEqual(BasketActionTypes.LoadBasketPaymentsSuccess);
        expect(i.next()).toBeUndefined();
      });
    });

    afterEach(() => {
      basketId = undefined;
    });
  });
});
