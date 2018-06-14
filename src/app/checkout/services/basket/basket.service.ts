import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, unpackEnvelope } from '../../../core/services/api/api.service';
import { BasketItemData } from '../../../models/basket-item/basket-item.interface';
import { BasketItemMapper } from '../../../models/basket-item/basket-item.mapper';
import { BasketItem } from '../../../models/basket-item/basket-item.model';
import { BasketData } from '../../../models/basket/basket.interface';
import { BasketMapper } from '../../../models/basket/basket.mapper';
import { Basket } from '../../../models/basket/basket.model';

/**
 * The Basket Service handles the interaction with the 'baskets' REST API.
 */
@Injectable({ providedIn: 'root' })
export class BasketService {
  constructor(private apiService: ApiService) {}

  /**
   * Get the basket for the given basket id or fallback to '-' as basket id to get the current basket for the current user.
   * @param basketId  The basket id.
   * @returns         The basket.
   */
  getBasket(basketId: string = '-'): Observable<Basket> {
    return this.apiService.get<BasketData>(`baskets/${basketId}`).pipe(map(BasketMapper.fromData));
  }

  /**
   * Get basket items for selected basket.
   * @param basketId  The basket id.
   * @returns         The basket items.
   */
  getBasketItems(basketId: string): Observable<BasketItem[]> {
    if (!basketId) {
      return throwError('getBasketItems() called without basketId');
    }

    return this.apiService
      .get(`baskets/${basketId}/items`)
      .pipe(unpackEnvelope<BasketItemData>(), map(basketItemsData => basketItemsData.map(BasketItemMapper.fromData)));
  }

  /**
   * Adds a list of items with the given sku and quantity to the given basket.
   * @param items     The list of product SKU and quantity pairs to be added to the basket.
   * @param basketId  The id of the basket to add the items to.
   */
  addItemsToBasket(items: { sku: string; quantity: number }[], basketId: string): Observable<void> {
    if (!items) {
      return throwError('addItemsToBasket() called without items');
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
   * Updates specific line items quantity in the given basket.
   * @param itemId    The id of the line item that should be updated.
   * @param quantity  The new quantity.
   * @param basketId  The id of the basket in which the item should be updated.
   */
  updateBasketItem(itemId: string, quantity: number, basketId: string): Observable<void> {
    const body = {
      quantity: {
        value: quantity,
      },
    };

    return this.apiService.put(`baskets/${basketId}/items/${itemId}`, body);
  }

  /**
   * Remove specific line item from the given basket.
   * @param itemId    The id of the line item that should be deleted.
   * @param basketId  The id of the basket where the item should be removed.
   */
  deleteBasketItem(itemId: string, basketId: string): Observable<void> {
    return this.apiService.delete(`baskets/${basketId}/items/${itemId}`);
  }
}
