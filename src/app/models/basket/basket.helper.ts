import { BasketItem } from '../basket-item/basket-item.model';

export class BasketHelper {
  /**
   * Calculates the number of items for an amount of line items - TODO: should be returned by the REST call
   * @param lineItems An array of basket/order line items
   * @returns Number of item quantities
   */
  static getBasketItemsCount(lineItems: BasketItem[]): number {
    if (!lineItems || lineItems.length === 0 || (lineItems.length > 0 && !lineItems[0].quantity)) {
      return 0;
    }

    return lineItems.map(item => item.quantity.value).reduce((l, r) => l + r, 0);
  }
}
