export class ComparePage {
  readonly tag = 'ish-product-compare-list';

  get visibleCompareItemSKUs() {
    return cy.get('span[itemprop="sku"]');
  }
}
