import { $, promise } from 'protractor';
import { Page } from './page.interface';

export class ProductDetailPage implements Page {
  tag = 'ish-product-page-container';
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
