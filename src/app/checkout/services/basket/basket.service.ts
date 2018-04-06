import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { ApiService } from '../../../core/services/api.service';
import { BasketData } from '../../../models/basket/basket.interface';
import { BasketMapper } from '../../../models/basket/basket.mapper';

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
    private apiService: ApiService
  ) { }

  /**
   * Get a specific product for the given basket id
   * fallbacks to last used basket
   *
   * @param basketId The basket id
   * @returns The basket data
   */
  getBasket(basketId: string = '-') {
    return this.apiService.get<BasketData>(this.basketServiceIdentifier + basketId).pipe(
      map(basketData => BasketMapper.fromData(basketData))
    );
  }
}
