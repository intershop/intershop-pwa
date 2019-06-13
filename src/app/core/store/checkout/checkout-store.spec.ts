// tslint:disable use-component-change-detection prefer-mocks-instead-of-stubs-in-tests
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { anyNumber, anything, instance, mock, when } from 'ts-mockito';

import { Product } from 'ish-core/models/product/product.model';
import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { User } from 'ish-core/models/user/user.model';
import { PromotionsService } from 'ish-core/services/promotions/promotions.service';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';
import {
  AVAILABLE_LOCALES,
  ENDLESS_SCROLLING_ITEMS_PER_PAGE,
  MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH,
} from '../../configurations/injection-keys';
import { Basket } from '../../models/basket/basket.model';
import { LoginCredentials } from '../../models/credentials/credentials.model';
import { Customer } from '../../models/customer/customer.model';
import { LineItem } from '../../models/line-item/line-item.model';
import { Locale } from '../../models/locale/locale.model';
import { Price } from '../../models/price/price.model';
import { AddressService } from '../../services/address/address.service';
import { BasketService } from '../../services/basket/basket.service';
import { CategoriesService } from '../../services/categories/categories.service';
import { CountryService } from '../../services/country/country.service';
import { FilterService } from '../../services/filter/filter.service';
import { OrderService } from '../../services/order/order.service';
import { ProductsService } from '../../services/products/products.service';
import { SuggestService } from '../../services/suggest/suggest.service';
import { UserService } from '../../services/user/user.service';
import { coreEffects, coreReducers } from '../core-store.module';
import { LoadProduct } from '../shopping/products';
import { shoppingEffects, shoppingReducers } from '../shopping/shopping-store.module';
import { LoginUser } from '../user';

import { AddItemsToBasket, AddProductToBasket, BasketActionTypes } from './basket';
import { checkoutEffects, checkoutReducers } from './checkout-store.module';

let basketId: string;

describe('Checkout Store', () => {
  const DEBUG = false;
  let store: TestStore;
  let locales: Locale[];

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
    availability: false,
  } as LineItem;

  const basket = {
    id: 'test',
    lineItems: [lineItem],
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
    type: 'Product',
    promotionIds: ['PROMO_UUID'],
  } as Product;

  const customer = {
    type: 'PrivateCustomer',
    customerNo: 'test',
  } as Customer;

  const user = {
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
  } as User;

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
    when(basketServiceMock.getBasket(anything())).thenCall(() => {
      const newBasket = {
        ...basket,
      };

      if (basketId) {
        newBasket.id = basketId;
      }

      return of(newBasket);
    });
    when(basketServiceMock.createBasket()).thenCall(() => {
      const newBasket = {
        ...basket,
      };

      if (basketId) {
        newBasket.id = basketId;
      }

      return of(newBasket);
    });

    when(basketServiceMock.getBaskets()).thenCall(() => {
      const newBaskets = [
        {
          ...basket,
        },
      ];

      if (basketId) {
        newBaskets[0].id = basketId;
      }

      return of(newBaskets);
    });

    when(basketServiceMock.addItemsToBasket(anything(), anything())).thenReturn(of(undefined));

    const productsServiceMock = mock(ProductsService);
    when(productsServiceMock.getProduct(anything())).thenReturn(of(product));

    const promotionsServiceMock = mock(PromotionsService);
    when(promotionsServiceMock.getPromotion(anything())).thenReturn(of(promotion));

    const userServiceMock = mock(UserService);
    when(userServiceMock.signinUser(anything())).thenReturn(of({ customer, user }));

    const filterServiceMock = mock(FilterService);
    const orderServiceMock = mock(OrderService);

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        ...ngrxTesting(
          {
            ...coreReducers,
            checkout: combineReducers(checkoutReducers),
            shopping: combineReducers(shoppingReducers),
          },
          [...coreEffects, ...checkoutEffects, ...shoppingEffects]
        ),
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
        { provide: PromotionsService, useFactory: () => instance(promotionsServiceMock) },
        { provide: UserService, useFactory: () => instance(userServiceMock) },
        { provide: FilterService, useFactory: () => instance(filterServiceMock) },
        { provide: SuggestService, useFactory: () => instance(mock(SuggestService)) },
        { provide: MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH, useValue: 1 },
        { provide: AVAILABLE_LOCALES, useValue: locales },
        { provide: ENDLESS_SCROLLING_ITEMS_PER_PAGE, useValue: 3 },
      ],
    });

    store = TestBed.get(TestStore);
    store.logActions = DEBUG;
    store.logState = DEBUG;
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('with anonymous user', () => {
    const payload = { sku: 'test', quantity: 1 };

    beforeEach(() => {
      store.dispatch(new LoadProduct({ sku: 'test' }));
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
        expect(i.next()).toBeUndefined();
      });
    });

    describe('and with basket', () => {
      it('should merge basket on user login.', () => {
        const i = store.actionsIterator([/Basket/]);
        basketId = 'newTest';
        store.reset();

        store.dispatch(new LoginUser({ credentials: {} as LoginCredentials }));
        expect(i.next().type).toEqual(BasketActionTypes.ResetBasket);
        expect(i.next()).toEqual(new AddItemsToBasket({ items: [payload], basketId: 'newTest' }));
        expect(i.next().type).toEqual(BasketActionTypes.AddItemsToBasketSuccess);
        expect(i.next().type).toEqual(BasketActionTypes.LoadBasket);
        expect(i.next().type).toEqual(BasketActionTypes.LoadBasketSuccess);
        expect(i.next()).toBeUndefined();
      });
    });

    afterEach(() => {
      basketId = undefined;
    });
  });
});
