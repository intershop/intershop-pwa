import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { BasketItem } from '../../../models/basket/basket-item.model';
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
   * Get the Basket for the given basket id or fallback to '-' as basket id to get the current basket for the current user.
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
    return this.apiService.get(`baskets/${basketId}/items`, undefined, undefined, true);
  }

  /**
   * Add a product with the given quantity to the given basket.
   * @param sku       The product to be added's sku.
   * @param quantity  The quantity of the product to add.
   * @param basketId  The id of the basket which the product should be added to.
   */
  addItemToBasket(sku: string, quantity: number = 1, basketId: string): Observable<void> {
    const body: Object = {
      elements: [
        {
          sku: sku,
          quantity: {
            value: quantity,
          },
        },
      ],
    };

    return this.apiService.post(`baskets/${basketId}/items`, body);
  }
}
