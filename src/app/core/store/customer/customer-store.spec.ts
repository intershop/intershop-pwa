import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { Basket } from 'ish-core/models/basket/basket.model';
import { Credentials } from 'ish-core/models/credentials/credentials.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { Product, ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { User } from 'ish-core/models/user/user.model';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { OrderService } from 'ish-core/services/order/order.service';
import { PaymentService } from 'ish-core/services/payment/payment.service';
import { TokenService } from 'ish-core/services/token/token.service';
import { UserService } from 'ish-core/services/user/user.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loadProductSuccess } from 'ish-core/store/shopping/products';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { addProductToBasket, loadBasketSuccess, startCheckout } from './basket';
import { loginUser, personalizationStatusDetermined } from './user';

describe('Customer Store', () => {
  let store: StoreWithSnapshots;

  const lineItem = {
    id: 'test',
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

  const customer = {
    isBusinessCustomer: false,
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

  const pgid = 'spgid';

  beforeEach(() => {
    const basketServiceMock = mock(BasketService);
    when(basketServiceMock.getBasket()).thenReturn(of(basket));
    when(basketServiceMock.createBasket()).thenReturn(of(basket));
    when(basketServiceMock.getBaskets()).thenReturn(of([]));
    when(basketServiceMock.mergeBasket(anything(), anything(), anything())).thenReturn(of(basket));
    when(basketServiceMock.validateBasket(anything())).thenReturn(
      of({
        basket,
        results: {
          valid: true,
          adjusted: false,
        },
      })
    );

    const userServiceMock = mock(UserService);
    when(userServiceMock.signInUser(anything())).thenReturn(of({ customer, user, pgid }));

    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['configuration', 'serverConfig'], true),
        CustomerStoreModule,
        HttpClientTestingModule,

        ShoppingStoreModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: BasketService, useFactory: () => instance(basketServiceMock) },
        { provide: CookiesService, useFactory: () => instance(mock(CookiesService)) },
        { provide: OrderService, useFactory: () => instance(mock(OrderService)) },
        { provide: PaymentService, useFactory: () => instance(mock(PaymentService)) },
        { provide: TokenService, useFactory: () => instance(mock(TokenService)) },
        { provide: UserService, useFactory: () => instance(userServiceMock) },
        provideRouter([
          {
            path: 'account',
            children: [],
          },
          {
            path: 'checkout/address',
            children: [],
          },
        ]),
        provideStoreSnapshots(),
      ],
    });

    store = TestBed.inject(StoreWithSnapshots);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  describe('with anonymous user', () => {
    beforeEach(() => {
      store.dispatch(
        loadProductSuccess({
          product: { sku: 'test', packingUnit: 'pcs.', completenessLevel: ProductCompletenessLevel.List } as Product,
        })
      );
      store.dispatch(addProductToBasket({ sku: 'test', quantity: 1 }));
      store.dispatch(personalizationStatusDetermined());
    });

    describe('and with basket', () => {
      beforeEach(() => {
        store.dispatch(loadBasketSuccess({ basket }));

        store.reset();
      });

      it('should merge basket on user login.', () => {
        store.dispatch(loginUser({ credentials: {} as Credentials }));

        expect(store.actionsArray()).toMatchInlineSnapshot(`
          [User] Login User:
            credentials: {}
          [User API] Login User Success:
            customer: {"isBusinessCustomer":false,"customerNo":"test"}
            user: {"title":"","firstName":"test","lastName":"test","phoneHome"...
            pgid: "spgid"
          [Basket API] Merge two baskets in progress
          [Basket API] Merge two baskets Success:
            basket: {"id":"test","lineItems":[1]}
        `);
      });

      it('should go to checkout address page after starting checkout.', () => {
        store.dispatch(startCheckout());
        expect(store.actionsArray()).toMatchInlineSnapshot(`
          [Basket] Start the checkout process
          [Basket] Validate Basket and continue checkout:
            targetStep: 1
          [Basket API] Validate Basket and continue with success:
            targetRoute: "/checkout/address"
            basketValidation: {"basket":{"id":"test","lineItems":[1]},"results":{"valid":t...
        `);
      });
    });
  });
});
