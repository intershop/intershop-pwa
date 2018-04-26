import { $, promise } from 'protractor';

export class ProductPage {
  addToCardButton = $('[data-testing-id="addToCartButton"]');
  getSku() {
    return $('span[itemprop="sku"]').getText();
  }

  getPrice() {
    return $('div[data-testing-id="current-price"]').getText();
  }

  isComplete(): promise.Promise<boolean> {
    return this.addToCardButton.isPresent();
  }
}
