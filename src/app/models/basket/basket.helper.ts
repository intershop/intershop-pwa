import { Basket } from './basket.model';

export class BasketHelper {
  /**
   * Calculates the number of items in the basket - TODO: should be returned by the REST call
   * @param basket The basket
   * @returns Number of basket item quantities
   */
  static getBasketItemsCount(basket: Basket): number {
    if (
      !basket ||
      !basket.lineItems ||
      basket.lineItems.length === 0 ||
      (basket.lineItems.length > 0 && !basket.lineItems[0].quantity)
    ) {
      return 0;
    }

    return basket.lineItems.map(item => item.quantity.value).reduce((l, r) => l + r, 0);
  }

  /**
   * Calculates whether the total is still estimated because of missing address or shipping data - ToDo: should be returned by the REST call
   * @param basket The basket
   * @returns if the basket total is estimated
   */
  static isEstimatedTotal(basket: Basket): boolean {
    return !(basket.invoiceToAddress && basket.commonShipToAddress && basket.commonShippingMethod);
  }
}
