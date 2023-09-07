import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { LineItemData } from 'ish-core/models/line-item/line-item.interface';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { OrderService } from 'ish-core/services/order/order.service';
import { getBasketIdOrCurrent, getCurrentBasket } from 'ish-core/store/customer/basket';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';

import { BasketItemUpdateType, BasketItemsService } from './basket-items.service';

describe('Basket Items Service', () => {
  let basketItemsService: BasketItemsService;
  let apiService: ApiService;
  let orderService: OrderService;

  const lineItemData = {
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
    apiService = mock(ApiService);
    orderService = mock(OrderService);

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiService) },
        { provide: OrderService, useFactory: () => instance(orderService) },
        provideMockStore({
          selectors: [
            { selector: getBasketIdOrCurrent, value: 'current' },
            { selector: getCurrentBasket, value: { id: '123' } },
          ],
        }),
      ],
    });
    basketItemsService = TestBed.inject(BasketItemsService);
  });

  it("should post item to basket when 'addItemsToBasket' is called", done => {
    when(apiService.post(anything(), anything(), anything())).thenReturn(of({ data: [], infos: undefined }));

    basketItemsService.addItemsToBasket([itemMockData]).subscribe(() => {
      verify(apiService.post(`baskets/current/items`, anything(), anything())).once();
      done();
    });
  });

  it("should patch updated data to basket line item of a basket when 'updateBasketItem' is called", done => {
    when(apiService.patch(anyString(), anything(), anything())).thenReturn(
      of({ data: { id: lineItemData.id, calculated: false } as LineItemData, infos: undefined })
    );

    const payload = { quantity: { value: 2 } } as BasketItemUpdateType;
    basketItemsService.updateBasketItem(lineItemData.id, payload).subscribe(() => {
      verify(apiService.patch(`baskets/current/items/${lineItemData.id}`, payload, anything())).once();
      done();
    });
  });

  it("should remove line item from specific basket when 'deleteBasketItem' is called", done => {
    when(apiService.delete(anyString(), anything())).thenReturn(of({}));

    basketItemsService.deleteBasketItem(lineItemData.id).subscribe(() => {
      verify(apiService.delete(`baskets/current/items/${lineItemData.id}`, anything())).once();
      done();
    });
  });

  describe('Update Basket Items desired delivery date', () => {
    const lineItems: LineItem[] = [
      ...BasketMockData.getBasket().lineItems,
      { id: 'withdesiredDeliveryDate', desiredDeliveryDate: '2022-20-02' } as LineItem,
    ];

    it("should update the desired delivery date at all basket items when 'updateBasketItemsDesiredDeliveryDate' is called", done => {
      when(apiService.patch(anyString(), anything(), anything())).thenReturn(
        of({ data: { id: lineItemData.id, calculated: false } as LineItemData, infos: undefined })
      );

      basketItemsService.updateBasketItemsDesiredDeliveryDate('2022-22-02', lineItems).subscribe(() => {
        verify(apiService.patch(anything(), anything(), anything())).twice();
        done();
      });
    });

    it("should not update the desired delivery date at those basket items that have already the correct date when 'updateBasketItemsDesiredDeliveryDate' is called", done => {
      when(apiService.patch(anyString(), anything(), anything())).thenReturn(
        of({ data: { id: lineItemData.id, calculated: false } as LineItemData, infos: undefined })
      );

      basketItemsService.updateBasketItemsDesiredDeliveryDate('2022-20-02', lineItems).subscribe(() => {
        verify(apiService.patch(anything(), anything(), anything())).once();
        done();
      });
    });
  });
});
