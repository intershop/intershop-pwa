import { Basket } from './basket.model';

export class BasketHelper {
  /**
   * Calculates the number of items in the basket - TODO: should be returned by the REST call
   * @param basket The basket
   * @returns Number of basket item quantities
   */
  static getBasketItemsCount(basket: Basket): number {
    if (!basket || !basket.lineItems) {
      return 0;
    }

    return basket.lineItems.map(item => item.quantity.value).reduce((l, r) => l + r, 0);
  }
}
