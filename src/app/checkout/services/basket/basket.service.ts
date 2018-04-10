import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { BasketData } from '../../../models/basket/basket.interface';
import { BasketMapper } from '../../../models/basket/basket.mapper';
import { Basket } from '../../../models/basket/basket.model';

/**
 * The basket service handles the interaction with the 'baskets' REST API.
 */
@Injectable()
export class BasketService {

  /**
   * The REST API URI endpoints
   */
  basketServiceIdentifier = 'baskets/';

  constructor(
    private apiService: ApiService,
  ) { }

  /**
   * Get a specific product for the given basket id
   * fallbacks to last used basket
   *
   * @param basketId The basket id
   * @returns The basket data
   */
  getBasket(basketId: string = '-'): Observable<Basket> {
    return this.apiService.get<BasketData>(this.basketServiceIdentifier + basketId).pipe(
      map(basketData => BasketMapper.fromData(basketData))
    );
  }

  /**
   * add product to specific basket
   *
   * @param sku product sku
   * @param quantity quantity of the product
   * @param basketId id of the basket which the product should be added in
   */
  // tslint:disable-next-line: no-any
  addItemToBasket(sku: string, quantity: number = 1, basketId: string): Observable<any> {
    const body: Object = {
      elements: [{
        sku: sku,
        quantity: {
          value: quantity
        }
      }]
    };

    return this.apiService.post(this.basketServiceIdentifier + basketId + '/items/', body);
  }

}
