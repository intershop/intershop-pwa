import { Component } from '@angular/core';
import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { combineReducers } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';
import { EMPTY, of } from 'rxjs';
import { anyNumber, anything, instance, mock, when } from 'ts-mockito';

import {
  AVAILABLE_LOCALES,
  DEFAULT_PRODUCT_LISTING_VIEW_TYPE,
  LARGE_BREAKPOINT_WIDTH,
  MAIN_NAVIGATION_MAX_SUB_CATEGORIES_DEPTH,
  MEDIUM_BREAKPOINT_WIDTH,
  PRODUCT_LISTING_ITEMS_PER_PAGE,
} from 'ish-core/configurations/injection-keys';
import { Basket } from 'ish-core/models/basket/basket.model';
import { LoginCredentials } from 'ish-core/models/credentials/credentials.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { Locale } from 'ish-core/models/locale/locale.model';
import { Price } from 'ish-core/models/price/price.model';
import { Product, ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { User } from 'ish-core/models/user/user.model';
import { AddressService } from 'ish-core/services/address/address.service';
import { BasketService } from 'ish-core/services/basket/basket.service';
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
import { LoadProductSuccess } from 'ish-core/store/shopping/products';
import { shoppingEffects, shoppingReducers } from 'ish-core/store/shopping/shopping-store.module';
import { LoginUser } from 'ish-core/store/user';
import { TestStore, ngrxTesting } from 'ish-core/utils/dev/ngrx-testing';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

import { AddProductToBasket } from './basket';
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
    quantity: { type: 'test', value: 1, unit: 'pcs.' },
    productSKU: 'test',
    price: undefined,
    singleBasePrice: undefined,
    isHiddenGift: false,
    isFreeGift: false,
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

    const configurationServiceMock = mock(ConfigurationService);
    when(configurationServiceMock.getServerConfiguration()).thenReturn(EMPTY);

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

    when(basketServiceMock.mergeBasket(anything(), anything())).thenCall(() => {
      const newBasket = {
        ...basket,
      };
      return of(newBasket);
    });

    when(basketServiceMock.addItemsToBasket(anything(), anything())).thenReturn(of(undefined));

    const productsServiceMock = mock(ProductsService);
    when(productsServiceMock.getProduct(anything())).thenReturn(of(product));

    const promotionsServiceMock = mock(PromotionsService);
    when(promotionsServiceMock.getPromotion(anything())).thenReturn(of(promotion));

    const userServiceMock = mock(UserService);
    when(userServiceMock.signinUser(anything())).thenReturn(of({ customer, user }));

    const personalizationServiceMock = mock(PersonalizationService);
    when(personalizationServiceMock.getPGID()).thenReturn(EMPTY);

    const filterServiceMock = mock(FilterService);
    const orderServiceMock = mock(OrderService);

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'account',
            component: DummyComponent,
          },
        ]),
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
        ngrxTesting({
          reducers: {
            ...coreReducers,
            checkout: combineReducers(checkoutReducers),
            shopping: combineReducers(shoppingReducers),
          },
          effects: [...coreEffects, ...checkoutEffects, ...shoppingEffects],
        }),
      ],
      providers: [
        { provide: AddressService, useFactory: () => instance(mock(AddressService)) },
        { provide: BasketService, useFactory: () => instance(basketServiceMock) },
        { provide: PaymentService, useFactory: () => instance(mock(PaymentService)) },
        { provide: OrderService, useFactory: () => instance(orderServiceMock) },
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
        { provide: ConfigurationService, useFactory: () => instance(configurationServiceMock) },
        { provide: CountryService, useFactory: () => instance(countryServiceMock) },
        { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
        { provide: PromotionsService, useFactory: () => instance(promotionsServiceMock) },
        { provide: UserService, useFactory: () => instance(userServiceMock) },
        { provide: PersonalizationService, useFactory: () => instance(personalizationServiceMock) },
        { provide: FilterService, useFactory: () => instance(filterServiceMock) },
        { provide: SuggestService, useFactory: () => instance(mock(SuggestService)) },
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
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('with anonymous user', () => {
    beforeEach(fakeAsync(() => {
      store.dispatch(
        new LoadProductSuccess({
          product: { sku: 'test', packingUnit: 'pcs.', completenessLevel: ProductCompletenessLevel.List } as Product,
        })
      );
      store.dispatch(new AddProductToBasket({ sku: 'test', quantity: 1 }));
      tick(5000);
    }));

    describe('and without basket', () => {
      it('should initially load basket and basketItems on product add.', fakeAsync(() => {
        expect(store.actionsArray(/Basket|Shopping/)).toMatchInlineSnapshot(`
          [Shopping] Load Product Success:
            product: {"sku":"test","packingUnit":"pcs.","completenessLevel":2}
          [Basket] Add Product:
            sku: "test"
            quantity: 1
          [Basket Internal] Add Items To Basket:
            items: [{"sku":"test","quantity":1,"unit":"pcs."}]
          [Shopping] Load Product:
            sku: "test"
          [Basket Internal] Add Items To Basket:
            items: [{"sku":"test","quantity":1,"unit":"pcs."}]
            basketId: "test"
          [Shopping] Load Product Success:
            product: {"name":"test","shortDescription":"test","longDescription":"...
          [Basket API] Add Items To Basket Success:
            info: undefined
          [Shopping] Load Product:
            sku: "test"
          [Basket Internal] Load Basket
          [Shopping] Load Product Success:
            product: {"name":"test","shortDescription":"test","longDescription":"...
          [Basket API] Load Basket Success:
            basket: {"id":"test","lineItems":[1]}
          [Shopping] Load Product if not Loaded:
            sku: "test"
            level: 2
          [Shopping] Load Product:
            sku: "test"
          [Shopping] Load Product Success:
            product: {"name":"test","shortDescription":"test","longDescription":"...
        `);
      }));
    });

    describe('and with basket', () => {
      it('should merge basket on user login.', fakeAsync(() => {
        store.reset();
        store.dispatch(new LoginUser({ credentials: {} as LoginCredentials }));

        expect(store.actionsArray()).toMatchInlineSnapshot(`
          [Account] Login User:
            credentials: {}
          [Account API] Login User Success:
            customer: {"type":"PrivateCustomer","customerNo":"test"}
            user: {"title":"","firstName":"test","lastName":"test","phoneHome"...
          [Basket Internal] Merge two baskets
          [Basket API] Merge two baskets Success:
            basket: {"id":"test","lineItems":[1]}
          [Shopping] Load Product if not Loaded:
            sku: "test"
            level: 2
          [Shopping] Load Product:
            sku: "test"
          [Shopping] Load Product Success:
            product: {"name":"test","shortDescription":"test","longDescription":"...
        `);
        tick(5000);
      }));
    });

    afterEach(() => {
      basketId = undefined;
    });
  });
});
