import { at } from '../../framework';
import { HomePage } from '../../pages/home.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  masterSKU: '201807231',
  featuredVariationSKU: '201807231-01',
  numberOfVariations: 6,
};

describe('Variation Handling B2B', () => {
  describe('starting at home page', () => {
    before(() => HomePage.navigateTo());

    it('navigating to a variation product', () => {
      at(HomePage, page => page.gotoFeaturedProduct(_.featuredVariationSKU));
    });

    it('should be at that variation', () => {
      at(ProductDetailPage, page => {
        page.sku.should('have.text', _.featuredVariationSKU);
        page.accordionItem('Details').should('be.visible');
      });
    });
  });

  describe('starting at variation', () => {
    before(() => ProductDetailPage.navigateTo(_.featuredVariationSKU));

    it('should be at that variation', () => {
      at(ProductDetailPage, page => {
        page.sku.should('have.text', _.featuredVariationSKU);
        page.accordionItem('Details').should('be.visible');
      });
    });

    it('following link to all variations should redirect to master product', () => {
      at(ProductDetailPage, page => page.gotoMasterProduct());
      at(ProductDetailPage, page => {
        page.sku.should('have.text', _.masterSKU);
        page.variations.numberOfItems.should('equal', _.numberOfVariations);
      });
    });
  });

  describe('starting at master', () => {
    before(() => ProductDetailPage.navigateTo(_.masterSKU));

    it('should be at master variation selection', () => {
      at(ProductDetailPage, page => {
        page.sku.should('have.text', _.masterSKU);
        page.accordionItem('Details').should('be.visible');
        page.variations.numberOfItems.should('equal', _.numberOfVariations);
      });
    });
  });
});
