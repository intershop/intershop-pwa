import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { concatLatestFrom } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { Observable, forkJoin, iif, of, throwError } from 'rxjs';
import { concatMap, first, map } from 'rxjs/operators';

import { BasketInfoMapper } from 'ish-core/models/basket-info/basket-info.mapper';
import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { ErrorFeedback } from 'ish-core/models/http-error/http-error.model';
import { LineItemData } from 'ish-core/models/line-item/line-item.interface';
import { LineItemMapper } from 'ish-core/models/line-item/line-item.mapper';
import { AddLineItemType, LineItem, LineItemView } from 'ish-core/models/line-item/line-item.model';
import { ApiService } from 'ish-core/services/api/api.service';
import { getServerConfigParameter } from 'ish-core/store/core/server-config';
import { getCurrentBasket } from 'ish-core/store/customer/basket';

export type BasketItemUpdateType =
  | { quantity?: { value: number; unit: string }; product?: string }
  | { shippingMethod?: { id: string } }
  | { desiredDelivery?: string }
  | { calculated: boolean }
  | { warranty?: string };

/**
 * The Basket-Items Service handles basket line-item related calls for the 'baskets/items' REST API.
 */
@Injectable({ providedIn: 'root' })
export class BasketItemsService {
  constructor(private apiService: ApiService, private store: Store) {}

  /**
   * http header for Basket API v1
   */
  private basketHeaders = new HttpHeaders({
    'content-type': 'application/json',
    Accept: 'application/vnd.intershop.basket.v1+json',
  });

  /**
   * Adds a list of items with the given sku and quantity to the currently used basket.
   *
   * @param   items       The list of product SKU and quantity pairs to be added to the basket.
   * @returns lineItems   The list of line items, that have been added to the basket.
   *          info        Info responded by the server.
   *          errors      Errors responded by the server.
   */
  addItemsToBasket(
    items: AddLineItemType[]
  ): Observable<{ lineItems: LineItem[]; info: BasketInfo[]; errors: ErrorFeedback[] }> {
    if (!items) {
      return throwError(() => new Error('addItemsToBasket() called without items'));
    }

    return this.store.pipe(
      select(getCurrentBasket),
      first(),
      concatLatestFrom(() =>
        this.store.pipe(select(getServerConfigParameter<boolean>('shipping.multipleShipmentsSupported')))
      ),
      concatMap(([basket, multipleShipmentsSupported]) =>
        this.apiService
          .currentBasketEndpoint()
          .post<{ data: LineItemData[]; infos: BasketInfo[]; errors?: ErrorFeedback[] }>(
            'items',
            this.mapItemsToAdd(basket, items, multipleShipmentsSupported),
            {
              headers: this.basketHeaders,
            }
          )
          .pipe(
            map(payload => ({
              lineItems: payload.data.map(item => LineItemMapper.fromData(item)),
              info: BasketInfoMapper.fromInfo({ infos: payload.infos }),
              errors: payload.errors,
            }))
          )
      )
    );
  }

  private mapItemsToAdd(basket: Basket, items: AddLineItemType[], multipleShipmentsSupported: boolean) {
    return items.map(item => ({
      product: item.sku,
      quantity: {
        value: item.quantity,
        unit: item.unit,
      },
      ...(multipleShipmentsSupported && { shippingMethod: basket?.commonShippingMethod?.id }),
      ...(item.warrantySku && { warranty: item.warrantySku }),
    }));
  }

  /**
   * Updates a specific line item (quantity/shipping method) of the currently used basket.
   *
   * @param itemId    The id of the line item that should be updated.
   * @param body      request body
   * @returns         The line item and possible infos after the update.
   */
  updateBasketItem(itemId: string, body: BasketItemUpdateType): Observable<{ lineItem: LineItem; info: BasketInfo[] }> {
    return this.apiService
      .currentBasketEndpoint()
      .patch<{ data: LineItemData; infos: BasketInfo[] }>(`items/${this.apiService.encodeResourceId(itemId)}`, body, {
        headers: this.basketHeaders,
      })
      .pipe(
        map(payload => ({
          lineItem: LineItemMapper.fromData(payload.data),
          info: BasketInfoMapper.fromInfo({ infos: payload.infos }),
        }))
      );
  }

  /**
   * Removes a specific line item from the currently used basket.
   *
   * @param itemId    The id of the line item that should be deleted.
   */
  deleteBasketItem(itemId: string): Observable<BasketInfo[]> {
    return this.apiService
      .currentBasketEndpoint()
      .delete<{ infos: BasketInfo[] }>(`items/${this.apiService.encodeResourceId(itemId)}`, {
        headers: this.basketHeaders,
      })
      .pipe(
        map(payload => ({ ...payload, itemId })),
        map(BasketInfoMapper.fromInfo)
      );
  }

  /**
   * Removes all line items from the currently used basket.
   */
  deleteBasketItems(): Observable<BasketInfo[]> {
    return this.apiService
      .currentBasketEndpoint()
      .delete<{ infos: BasketInfo[] }>(`items`, {
        headers: this.basketHeaders,
      })
      .pipe(
        map(payload => ({ ...payload })),
        map(BasketInfoMapper.fromInfo)
      );
  }

  /**
   * Updates the desired delivery date at all those line items of the current basket, whose desired delivery date differs from the given date.
   *
   * @param  desiredDeliveryDate      Desired delivery date in iso format, i.e. yyyy-mm-dd.
   * @param lineItems                 Array of basket line items
   * @returns                         Array of updated line items and basket
   */
  updateBasketItemsDesiredDeliveryDate(
    desiredDeliveryDate: string,
    lineItems: LineItemView[]
  ): Observable<{ lineItem: LineItem; info: BasketInfo[] }[]> {
    if (desiredDeliveryDate && !new RegExp(/\d{4}-\d{2}-\d{2}/).test(desiredDeliveryDate)) {
      return throwError(
        () => new Error('updateBasketItemsDesiredDeliveryDate() called with an invalid desiredDeliveryDate')
      );
    }

    const obsArray = lineItems
      ?.filter(item => item.desiredDeliveryDate !== desiredDeliveryDate)
      ?.map(item => this.updateBasketItem(item.id, { desiredDelivery: desiredDeliveryDate }));

    return iif(() => !!obsArray.length, forkJoin(obsArray), of([]));
  }
}
