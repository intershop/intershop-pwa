import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store, select } from '@ngrx/store';
import { MatomoTracker, NgxMatomoTrackerModule } from '@ngx-matomo/tracker';
import { Observable, of } from 'rxjs';
import { instance, mock, verify } from 'ts-mockito';

import { Basket } from 'ish-core/models/basket/basket.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { ProductPriceDetails } from 'ish-core/models/product-prices/product-prices.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { addItemsToBasketSuccess, createBasketSuccess, deleteBasketItem } from 'ish-core/store/customer/basket';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loadProductPricesSuccess } from 'ish-core/store/shopping/product-prices';
import { getProduct } from 'ish-core/store/shopping/products';
import { ApiTokenService } from 'ish-core/utils/api-token/api-token.service';

import { MatomoEffects } from './matomo.effects';

describe('Matomo Effects', () => {
  let actions$: Observable<Action>;
  let tracker: MatomoTracker;
  let effects: MatomoEffects;
  let store: Store;

  beforeEach(() => {
    tracker = mock(MatomoTracker);
    TestBed.configureTestingModule({
      imports: [
        CoreStoreModule.forTesting(),
        CustomerStoreModule.forTesting('user', 'basket'),
        NgxMatomoTrackerModule.forRoot({ disabled: true, trackerUrl: undefined, siteId: undefined }),
        RouterTestingModule.withRoutes([{ path: '**', children: [] }]),
      ],
      providers: [
        { provide: ApiTokenService, useFactory: () => instance(mock(ApiTokenService)) },
        { provide: MatomoTracker, useFactory: () => instance(tracker) },
        MatomoEffects,
        provideMockActions(() => actions$),
      ],
    });
    effects = TestBed.inject(MatomoEffects);
    store = TestBed.inject(Store);
  });

  describe('trackPageViewTagManager', () => {
    it('should call the trackPageViewTagManager', done => {
      const price: ProductPriceDetails = { sku: '123', prices: {} };
      const prics: ProductPriceDetails[] = [price];
      const action = loadProductPricesSuccess({ prices: prics });

      actions$ = of(action);

      effects.trackPageViewTagManager.subscribe(() => {
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
        price: undefined,
        singleBasePrice: undefined,
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
    });

    // describe('addItemToBasket$', () => {
    //   it('should send product data to matomo', done => {
    //     const action = addItemsToBasketSuccess;
    //     actions$ = of(action);

    //     const productView = select(getProduct('123'));
    //     productView = of(productView);

    //     effects.addItemToBasket$.subscribe(() => {
    //       verify(
    //         tracker.addEcommerceItem(
    //           lineItem.productSKU,
    //           'test',
    //           'category',
    //           lineItem.price.net,
    //           lineItem.quantity.value
    //         )
    //       ).once();
    //       done();
    //     });
    //   });
    // });

    describe('deleteProductFromBasket$', () => {
      it('should delete product from basket', done => {
        const action = deleteBasketItem({ itemId: lineItem.id });

        actions$ = of(action);

        effects.deleteProductFromBasket$.subscribe(() => {
          verify(tracker.removeEcommerceItem(lineItem.productSKU)).once();
          done();
        });
      });
    });
  });
});
