import { at, back } from '../../framework';
import { HomePage } from '../../pages/home.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  masterSKU: '201807231',
  featuredVariationSKU: '201807231-03',
  otherVariationSKU: '201807231-01',
  defaultVariationSKU: '201807231-04',
};

describe('Variation Handling B2C', () => {
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

    it('changing the variation should redirect to other variation', () => {
      at(ProductDetailPage, page => page.changeVariationWithSelect('Hard_disk_drive_capacity', '256GB'));
      at(ProductDetailPage, page => page.sku.should('have.text', _.otherVariationSKU));
    });

    it('going back should display previous variation', () => {
      back();
      at(ProductDetailPage, page => page.sku.should('have.text', _.featuredVariationSKU));
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
  });

  describe('starting at master', () => {
    before(() => ProductDetailPage.navigateTo(_.masterSKU));

    it('should be at default variation instead', () => {
      at(ProductDetailPage, page => {
        page.sku.should('have.text', _.defaultVariationSKU);
        page.accordionItem('Details').should('be.visible');
      });
    });
  });
});
