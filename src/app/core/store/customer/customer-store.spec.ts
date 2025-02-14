import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { EMPTY, of } from 'rxjs';
import { anyNumber, anything, instance, mock, when } from 'ts-mockito';

import { Basket } from 'ish-core/models/basket/basket.model';
import { Credentials } from 'ish-core/models/credentials/credentials.model';
import { Customer } from 'ish-core/models/customer/customer.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { Product, ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { Promotion } from 'ish-core/models/promotion/promotion.model';
import { User } from 'ish-core/models/user/user.model';
import { AddressService } from 'ish-core/services/address/address.service';
import { AuthorizationService } from 'ish-core/services/authorization/authorization.service';
import { BasketItemsService } from 'ish-core/services/basket-items/basket-items.service';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { CategoriesService } from 'ish-core/services/categories/categories.service';
import { ConfigurationService } from 'ish-core/services/configuration/configuration.service';
import { CountryService } from 'ish-core/services/country/country.service';
import { DataRequestsService } from 'ish-core/services/data-requests/data-requests.service';
import { FilterService } from 'ish-core/services/filter/filter.service';
import { NewsletterService } from 'ish-core/services/newsletter/newsletter.service';
import { OrderService } from 'ish-core/services/order/order.service';
import { PaymentService } from 'ish-core/services/payment/payment.service';
import { PricesService } from 'ish-core/services/prices/prices.service';
import { ProductsService } from 'ish-core/services/products/products.service';
import { PromotionsService } from 'ish-core/services/promotions/promotions.service';
import { RecurringOrdersService } from 'ish-core/services/recurring-orders/recurring-orders.service';
import { SuggestService } from 'ish-core/services/suggest/suggest.service';
import { TokenService } from 'ish-core/services/token/token.service';
import { UserService } from 'ish-core/services/user/user.service';
import { WarrantyService } from 'ish-core/services/warranty/warranty.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loadProductSuccess } from 'ish-core/store/shopping/products';
import { ShoppingStoreModule } from 'ish-core/store/shopping/shopping-store.module';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';

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

  const product = {
    name: 'test',
    shortDescription: 'test',
    longDescription: 'test',
    available: true,
    minOrderQuantity: 1,
    attributes: [],
    images: [],
    manufacturer: 'test',
    readyForShipmentMin: 1,
    readyForShipmentMax: 1,
    sku: 'test',
    type: 'Product',
    promotionIds: ['PROMO_UUID'],
  } as Product;

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
    const basketItemsServiceMock = mock(BasketItemsService);
    when(basketItemsServiceMock.addItemsToBasket(anything())).thenReturn(of(undefined));

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

    const categoriesServiceMock = mock(CategoriesService);
    when(categoriesServiceMock.getTopLevelCategories(anyNumber())).thenReturn(of(categoryTree()));

    const configurationServiceMock = mock(ConfigurationService);
    when(configurationServiceMock.getServerConfiguration()).thenReturn(EMPTY);

    const countryServiceMock = mock(CountryService);
    when(countryServiceMock.getCountries()).thenReturn(of([{ countryCode: 'DE', name: 'Germany' }]));

    const productsServiceMock = mock(ProductsService);
    when(productsServiceMock.getProduct(anything())).thenReturn(of(product));

    const promotionsServiceMock = mock(PromotionsService);
    when(promotionsServiceMock.getPromotion(anything())).thenReturn(of(promotion));

    const userServiceMock = mock(UserService);
    when(userServiceMock.signInUser(anything())).thenReturn(of({ customer, user, pgid }));

    const productPriceServiceMock = mock(PricesService);
    when(productPriceServiceMock.getProductPrices(anything())).thenReturn(of([]));

    const oAuthService = mock(OAuthService);
    when(oAuthService.events).thenReturn(of());

    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(['configuration', 'serverConfig'], true),
        CustomerStoreModule,
        RouterTestingModule.withRoutes([
          {
            path: 'account',
            children: [],
          },
          {
            path: 'checkout/address',
            children: [],
          },
        ]),
        ShoppingStoreModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: AddressService, useFactory: () => instance(mock(AddressService)) },
        { provide: AuthorizationService, useFactory: () => instance(mock(AuthorizationService)) },
        { provide: BasketItemsService, useFactory: () => instance(basketItemsServiceMock) },
        { provide: BasketService, useFactory: () => instance(basketServiceMock) },
        { provide: CategoriesService, useFactory: () => instance(categoriesServiceMock) },
        { provide: CookiesService, useFactory: () => instance(mock(CookiesService)) },
        { provide: DataRequestsService, useFactory: () => instance(mock(DataRequestsService)) },
        { provide: FilterService, useFactory: () => instance(mock(FilterService)) },
        { provide: NewsletterService, useFactory: () => instance(mock(NewsletterService)) },
        { provide: OrderService, useFactory: () => instance(mock(OrderService)) },
        { provide: PaymentService, useFactory: () => instance(mock(PaymentService)) },
        { provide: PricesService, useFactory: () => instance(productPriceServiceMock) },
        { provide: ProductsService, useFactory: () => instance(productsServiceMock) },
        { provide: PromotionsService, useFactory: () => instance(promotionsServiceMock) },
        { provide: RecurringOrdersService, useFactory: () => instance(mock(RecurringOrdersService)) },
        { provide: SuggestService, useFactory: () => instance(mock(SuggestService)) },
        { provide: TokenService, useFactory: () => instance(mock(TokenService)) },
        { provide: UserService, useFactory: () => instance(userServiceMock) },
        { provide: WarrantyService, useFactory: () => instance(mock(WarrantyService)) },
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
