import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anyString, anything, deepEqual, instance, mock, verify, when } from 'ts-mockito';

import { LineItemData } from 'ish-core/models/line-item/line-item.interface';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getServerConfig } from 'ish-core/store/core/server-config';
import { getCurrentBasket } from 'ish-core/store/customer/basket';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { BasketItemUpdateType, BasketItemsService } from './basket-items.service';

describe('Basket Items Service', () => {
  let basketItemsService: BasketItemsService;
  let apiServiceMock: ApiService;
  let store$: MockStore;

  const lineItemMockData = {
    id: 'test',
    quantity: {
      type: 'Quantity',
      unit: '',
      value: 1,
    },
  };

  const itemMockData = {
    sku: 'test',
    quantity: 10,
    unit: 'pcs.',
  };

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    when(apiServiceMock.currentBasketEndpoint()).thenReturn(instance(apiServiceMock));
    when(apiServiceMock.encodeResourceId(anything())).thenCall(id => id);

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        provideMockStore({
          selectors: [
            {
              selector: getCurrentBasket,
              value: { id: '123', commonShippingMethod: { id: BasketMockData.getShippingMethod().id } },
            },
            { selector: getServerConfig, value: { shipping: { multipleShipmentsSupported: true } } },
          ],
        }),
      ],
    });

    basketItemsService = TestBed.inject(BasketItemsService);
    store$ = TestBed.inject(MockStore);
  });

  describe('Add Items To Basket', () => {
    interface TestAddLineItemType {
      product: string;
      quantity: {
        value: number;
        unit: string;
      };
      warrantySku?: string;
      shippingMethod?: string;
    }

    type TestData = {
      multipleShipment: boolean;
      expectedPayload: TestAddLineItemType[];
    };

    // perform test for possible use cases: multiple and single shipment
    it.each<TestData>([
      {
        // multiple shipment
        multipleShipment: true,
        expectedPayload: [
          {
            product: itemMockData.sku,
            quantity: { value: itemMockData.quantity, unit: itemMockData.unit },
            shippingMethod: BasketMockData.getShippingMethod().id,
          },
        ],
      },
      {
        // single shipment
        multipleShipment: false,
        expectedPayload: [
          {
            product: itemMockData.sku,
            quantity: { value: itemMockData.quantity, unit: itemMockData.unit },
          },
        ],
      },
    ])("should post item to basket when 'addItemsToBasket' is called", (testData: TestData, done) => {
      when(apiServiceMock.post(anyString(), anything(), anything())).thenReturn(of({ data: [], infos: undefined }));
      store$.overrideSelector(getServerConfig, { shipping: { multipleShipmentsSupported: testData.multipleShipment } });

      basketItemsService.addItemsToBasket([itemMockData]).subscribe(() => {
        // basket-endpoint 'baskets/current' is not considered in the verify, only data that comes after it
        verify(apiServiceMock.post(`items`, deepEqual(testData.expectedPayload), anything())).once();
        done();
      });
    });
  });

  it("should patch updated data to basket line item of a basket when 'updateBasketItem' is called", done => {
    when(apiServiceMock.patch(anyString(), anything(), anything())).thenReturn(
      of({ data: { id: lineItemMockData.id, calculated: false } as LineItemData, infos: undefined })
    );

    const payload = { quantity: { value: 2 } } as BasketItemUpdateType;
    basketItemsService.updateBasketItem(lineItemMockData.id, payload).subscribe(() => {
      verify(apiServiceMock.patch(`items/${lineItemMockData.id}`, payload, anything())).once();
      done();
    });
  });

  it("should remove line item from specific basket when 'deleteBasketItem' is called", done => {
    when(apiServiceMock.delete(anyString(), anything())).thenReturn(of({}));

    basketItemsService.deleteBasketItem(lineItemMockData.id).subscribe(() => {
      verify(apiServiceMock.delete(`items/${lineItemMockData.id}`, anything())).once();
      done();
    });
  });

  it("should remove all line items from specific basket when 'deleteBasketItems' is called", done => {
    when(apiServiceMock.delete(anyString(), anything())).thenReturn(of({}));

    basketItemsService.deleteBasketItems().subscribe(() => {
      verify(apiServiceMock.delete(`items`, anything())).once();
      done();
    });
  });

  describe('Update Basket Items desired delivery date', () => {
    const lineItems: LineItem[] = [
      ...BasketMockData.getBasket().lineItems,
      { id: 'withdesiredDeliveryDate', desiredDeliveryDate: '2022-20-02' } as LineItem,
    ];

    it("should update the desired delivery date at all basket items when 'updateBasketItemsDesiredDeliveryDate' is called", done => {
      when(apiServiceMock.patch(anyString(), anything(), anything())).thenReturn(
        of({ data: { id: lineItemMockData.id, calculated: false } as LineItemData, infos: undefined })
      );

      basketItemsService.updateBasketItemsDesiredDeliveryDate('2022-22-02', lineItems).subscribe(() => {
        verify(apiServiceMock.patch(anyString(), anything(), anything())).twice();
        done();
      });
    });

    it("should not update the desired delivery date at those basket items that have already the correct date when 'updateBasketItemsDesiredDeliveryDate' is called", done => {
      when(apiServiceMock.patch(anyString(), anything(), anything())).thenReturn(
        of({ data: { id: lineItemMockData.id, calculated: false } as LineItemData, infos: undefined })
      );

      basketItemsService.updateBasketItemsDesiredDeliveryDate('2022-20-02', lineItems).subscribe(() => {
        verify(apiServiceMock.patch(anything(), anything(), anything())).once();
        done();
      });
    });
  });
});
