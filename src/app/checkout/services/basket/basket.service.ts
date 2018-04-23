import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { _throw } from 'rxjs/observable/throw';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { BasketItemData } from '../../../models/basket-item/basket-item.interface';
import { BasketItemMapper } from '../../../models/basket-item/basket-item.mapper';
import { BasketItem } from '../../../models/basket-item/basket-item.model';
import { BasketData } from '../../../models/basket/basket.interface';
import { BasketMapper } from '../../../models/basket/basket.mapper';
import { Basket } from '../../../models/basket/basket.model';

/**
 * The Basket Service handles the interaction with the 'baskets' REST API.
 */
@Injectable()
export class BasketService {
  constructor(private apiService: ApiService) {}

  /**
   * Get the basket for the given basket id or fallback to '-' as basket id to get the current basket for the current user.
   * @param basketId  The basket id.
   * @returns         The basket.
   */
  getBasket(basketId: string = '-'): Observable<Basket> {
    return this.apiService
      .get<BasketData>(`baskets/${basketId}`)
      .pipe(map(basketData => BasketMapper.fromData(basketData)));
  }

  /**
   * Get basket items for selected basket.
   * @param basketId  The basket id.
   * @returns         The basket items.
   */
  getBasketItems(basketId: string): Observable<BasketItem[]> {
    if (!basketId) {
      return _throw('getBasketItems() called without basketId');
    }

    return this.apiService
      .get<BasketItemData[]>(`baskets/${basketId}/items`, undefined, undefined, true)
      .pipe(map(basketItemsData => basketItemsData.map(basketItemData => BasketItemMapper.fromData(basketItemData))));
  }

  /**
   * Adds a list of items with the given sku and quantity to the given basket.
   * @param items     The list of product SKU and quantity pairs to be added to the basket.
   * @param basketId  The id of the basket to add the items to.
   */
  addItemsToBasket(items: { sku: string; quantity: number }[], basketId: string): Observable<void> {
    if (!items) {
      return _throw('addItemsToBasket() called without items');
    }

    const body = {
      elements: items.map(item => ({
        sku: item.sku,
        quantity: {
          value: item.quantity,
        },
      })),
    };

    return this.apiService.post(`baskets/${basketId}/items`, body);
  }

  /**
   * Updates specific line items quantity in the given basket
   *
   * @param quantity  The new quantity
   * @param itemId    The id of the line item that should be updated
   * @param basketId  The id of the basket in which the item should be updated
   */
  updateBasketItem(quantity: number, itemId: string, basketId: string): Observable<void> {
    const body = {
      quantity: {
        type: 'Quantity',
        value: quantity,
      },
    };

    return this.apiService.put(`baskets/${basketId}/items/${itemId}`, body);
  }

  /**
   * Remove specific line item from the given basket
   *
   * @param itemId    The id of the line item that should be deleted
   * @param basketId  The id of the basket where the item should be removed
   */
  deleteBasketItem(itemId: string, basketId: string): Observable<void> {
    return this.apiService.delete(`baskets/${basketId}/items/${itemId}`);
  }
}
