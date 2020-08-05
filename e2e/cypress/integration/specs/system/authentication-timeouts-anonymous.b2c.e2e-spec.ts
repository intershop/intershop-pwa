import { at, waitLoadingEnd } from '../../framework';
import { HomePage } from '../../pages/home.page';
import { FamilyPage } from '../../pages/shopping/family.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  category: 'Cameras-Camcorders.832',
  product: '8182790134362',
};

describe('Anonymous Sleeping User', () => {
  describe('being a long time on a family page', () => {
    it('should wait a long time on family page', () => {
      FamilyPage.navigateTo(_.category);
      at(FamilyPage, page => page.productList.productTile(_.product).should('be.visible'));
    });

    it('should not go to error page when clicking on product after a long time', () => {
      cy.server()
        .route({
          method: 'GET',
          url: `**/products/${_.product}*`,
          status: 400,
          response: 'Bad Request (AuthenticationTokenInvalid)',
        })
        .as('invalid');
      at(FamilyPage, page => {
        page.productList.gotoProductDetailPageBySku(_.product, () => cy.wait('@invalid'));
        cy.route({
          method: 'GET',
          url: `**/products/${_.product}*`,
        });

        waitLoadingEnd(5000);
      });
      at(ProductDetailPage, page => page.sku.should('have.text', _.product));
    });
  });

  describe('having a basket for a long time', () => {
    it('should add a product to cart as anonymous user', () => {
      ProductDetailPage.navigateTo(_.product);
      at(ProductDetailPage, page => {
        page.addProductToCart();
        waitLoadingEnd(1000);
        page.header.miniCart.text.should('contain', '1 item');
      });
    });

    it('should lose basket after a long time not doing anything', () => {
      cy.server()
        .route({
          method: 'GET',
          url: `**/cms/**`,
          status: 400,
          response: 'Bad Request (AuthenticationTokenInvalid)',
        })
        .as('invalid');
      at(ProductDetailPage, page => {
        page.header.gotoHomePage(() => cy.wait('@invalid'));
        cy.route({
          method: 'GET',
          url: `**/cms/**`,
        });

        waitLoadingEnd(5000);
      });
      at(HomePage, page => page.header.miniCart.text.should('contain', '0 items'));
    });
  });
});
