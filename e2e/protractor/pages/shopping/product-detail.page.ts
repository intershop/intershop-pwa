import { $, promise } from 'protractor';
import { HeaderModule } from '../header.module';

export class ProductDetailPage {
  readonly tag = 'ish-product-page-container';

  readonly header = new HeaderModule();

  private addToCardButton = () => $('[data-testing-id="addToCartButton"]');
  private addToCompareButton = () => $('[data-testing-id*="compare"]');

  isComplete(): promise.Promise<boolean> {
    return this.addToCardButton().isPresent();
  }

  getSku() {
    return $('span[itemprop="sku"]').getText();
  }

  getPrice() {
    return $('div[data-testing-id="current-price"]').getText();
  }

  addProductToCompare() {
    this.addToCompareButton().click();
  }
}
