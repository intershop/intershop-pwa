import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, StoreModule } from '@ngrx/store';
import { MatomoTracker, NgxMatomoTrackerModule } from '@ngx-matomo/tracker';
import { Observable, of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { ProductPriceDetails } from 'ish-core/models/product-prices/product-prices.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductsService } from 'ish-core/services/products/products.service';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import {
  addItemsToBasketSuccess,
  createBasketSuccess,
  deleteBasketItem,
  loadBasketSuccess,
  submitBasketSuccess,
  updateBasketItemSuccess,
} from 'ish-core/store/customer/basket';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loadProductPricesSuccess } from 'ish-core/store/shopping/product-prices';
import { loadProductSuccess } from 'ish-core/store/shopping/products';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';

import { MatomoEffects } from './matomo.effects';

describe('Matomo Effects', () => {
  let actions$: Observable<Action>;
  let tracker: MatomoTracker;
  let effects: MatomoEffects;
  let store: Store;
  let product: ProductView;
  let productsServiceMock: ProductsService;

  beforeEach(() => {
    tracker = mock(MatomoTracker);
    store = mock(Store);
    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(),
        CustomerStoreModule.forTesting('user', 'basket'),
        NgxMatomoTrackerModule.forRoot({ disabled: true, trackerUrl: undefined, siteId: undefined }),
        RouterTestingModule.withRoutes([{ path: '**', children: [] }]),
        StoreModule.forFeature('shopping', {}),
      ],
      providers: [
        { provide: ApiTokenService, useFactory: () => instance(mock(ApiTokenService)) },
        { provide: MatomoTracker, useFactory: () => instance(tracker) },
        { provide: Store, useFactory: () => instance(store) },
        MatomoEffects,
        provideMockActions(() => actions$),
      ],
    });
    effects = TestBed.inject(MatomoEffects);
  });

  describe('trackPageViewTagManager', () => {
    it('should call the trackPageViewTagManager', done => {
      const price: ProductPriceDetails = { sku: '123', prices: {} };
      const prics: ProductPriceDetails[] = [price];
      const action = loadProductPricesSuccess({ prices: prics });

      actions$ = of(action);

      effects.trackPageViewTagManager$.subscribe(() => {
        verify(tracker.trackEvent('ProductPageView', '123', 'pageView', 1)).once();
        done();
      });
    });
  });

  describe('Tests for effects that need lineItems and basket', () => {
    let lineItem: LineItem;

    beforeEach(async () => {
      lineItem = {
        id: '1',
        position: 1,
        quantity: {
          type: 'test',
          value: 1,
          unit: 'test',
        },
        productSKU: '123',
        price: {
          type: 'PriceItem',
          gross: 100,
          net: 80,
          currency: 'USD',
        },
        singleBasePrice: {
          type: 'PriceItem',
          gross: 100,
          net: 80,
          currency: 'USD',
        },
        undiscountedSingleBasePrice: undefined,
        totals: {
          salesTaxTotal: undefined,
          shippingTaxTotal: undefined,
          shippingTotal: undefined,
          total: undefined,
          undiscountedTotal: undefined,
          valueRebatesTotal: undefined,
        },
        isHiddenGift: false,
        isFreeGift: false,

        editable: false,
        quote: 'test',
      };

      const basketForTest: Basket = {
        id: 'BID',
        lineItems: [lineItem],
        totals: undefined,
      } as Basket;

      store.dispatch(createBasketSuccess({ basket: basketForTest }));

      const product: ProductView = {
        sku: '123',
        shortDescription: 'test',
        longDescription: 'test',
        available: true,
        availableStock: 1,
        minOrderQuantity: 1,
        maxOrderQuantity: 1,
        stepQuantity: 1,
        manufacturer: 'test',
        name: 'test',
        failed: false,
        completenessLevel: 1,
        packingUnit: 'test',
        type: 'test',
        promotionIds: ['test'],
        defaultCategoryId: 'test',
        defaultCategory: {
          name: 'testDefaultCategory',
          children: [],
          hasChildren: false,
          pathElements: [],
          uniqueId: '',
          categoryRef: '',
          categoryPath: [],
          hasOnlineProducts: false,
          description: '',
          images: [],
          attributes: [],
          completenessLevel: 0,
        },
        roundedAverageRating: 1,
        numberOfReviews: 1,
        readyForShipmentMin: 1,
        readyForShipmentMax: 1,
      };

      const productPrice = {
        sku: '123',
        prices: {
          salePrice: {
            net: 10.0,
          },
        },
      };

      //when(store.pipe(anything())).thenReturn(of('net'), of(product));
      when(store.pipe(anything())).thenReturn(of({ sku: '123', name: 'test' }), of(productPrice));
      //when(store.pipe(select(getCurrentBasket))).thenReturn(of(basketForTest));
      //when(store.pipe(select(getProduct(lineItem.productSKU)))).thenReturn(of(product));
      // const sel = select(getPriceDisplayType);
      // Mock the getPriceDisplayType selector to return 'net'
    });

    describe('addItemToBasket$', () => {
      it('should send product data to matomo', done => {
        const basketInfo: BasketInfo = {
          code: '200',
          message: 'test',
        };

        const action = addItemsToBasketSuccess({ lineItems: [lineItem], info: [basketInfo] });
        actions$ = of(action);

        effects.addItemToBasket$.subscribe(() => {
          verify(tracker.addEcommerceItem('123', 'test', 'testDefaultCategory', 80, 1)).once();
          done();
        });
      });
    });

    describe('deleteProductFromBasket$', () => {
      it('should delete product from basket', done => {
        const itemId = lineItem;
        const action = deleteBasketItem({ itemId: itemId.id });
        actions$ = of(action);

        effects.deleteProductFromBasket$.subscribe(() => {
          verify(tracker.removeEcommerceItem('1')).once();
          done();
        });
      });
    });

    describe('updateBasketValue$', () => {
      it('should update product value from basket and send to matomo', done => {
        const basketForUpdateTest: Basket = {
          id: 'BID',
          lineItems: [lineItem],
          totals: {
            total: {
              gross: 300,
              net: 80,
              currency: 'USD',
            },
          },
        } as Basket;

        const action = loadBasketSuccess({ basket: basketForUpdateTest });
        actions$ = of(action);

        effects.updateBasketValue$.subscribe(() => {
          verify(tracker.trackEcommerceCartUpdate(300)).once();
          done();
        });
      });
    });
    // eslint-disable-next-line jest/no-disabled-tests
    describe('updateBasketItem$', () => {
      it('should update items from basket and send to matomo', done => {
        const action = updateBasketItemSuccess({ lineItem, info: undefined });
        actions$ = of(action);

        effects.updateBasketItem$.subscribe(() => {
          verify(tracker.addEcommerceItem('123', 'test', 'testDefaultCategory', 100, 1)).once();
          done();
        });
      });
    });
    // eslint-disable-next-line jest/no-disabled-tests
    describe('trackSubmittedOrders$', () => {
      it('should trigger if a user submitted a order or navigated to another basket', done => {
        const basketTestSubmitOrder = {
          id: 'BID',
          totals: {
            total: {
              gross: 100,
              net: 80,
              currency: 'USD',
            },
          },
        } as Basket;

        const action = submitBasketSuccess();

        actions$ = of(action);

        effects.trackPageView$.subscribe(() => {
          verify(
            tracker.trackEcommerceOrder(basketTestSubmitOrder.id, basketTestSubmitOrder.totals.total.gross)
          ).once();
          verify(tracker.trackPageView()).once();
          done();
        });
      });
    });
    // eslint-disable-next-line jest/no-disabled-tests
    fdescribe('trackPageView', () => {
      it('should trigger when a product detail page is called', done => {
        const action = loadProductSuccess({ product: { sku: '123', name: 'test' } });

        actions$ = of(action);

        console.log(effects.trackPageView$);
        effects.trackPageView$.subscribe(() => {
          verify(tracker.setEcommerceView('123', 'test')).once();
          verify(tracker.trackPageView()).once();
          done();
        });
      });
    });
  });
});
