import { at } from '../../framework';
import { MyAccountPage } from '../../pages/account/my-account.page';
import { Registration, RegistrationPage, sensibleDefaults } from '../../pages/account/registration.page';
import { CartPage } from '../../pages/checkout/cart.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  productSku: '201807171',
  user: {
    login: `testuser${new Date().getTime()}@test.intershop.de`,
    ...sensibleDefaults,
  } as Registration,
};

describe('Promotion Handling in Cart', () => {
  before(() => {
    ProductDetailPage.navigateTo(_.productSku);
  });

  it('user adds a promotion code that cannot applied yet', () => {
    at(ProductDetailPage, page => {
      page.addProductToCart().its('response.statusCode').should('equal', 201);
      page.header.miniCart.goToCart();
    });
    at(CartPage, page => {
      page.lineItems.should('have.length', 1);
      page.collapsePromotionForm();
      page.submitPromotionCode('INTERSHOP');
      page.errorMessage.message.should('contain', 'promotion code');
      page.promotion.should('not.exist');
    });
  });

  it('user adds a promotion code that can be applied yet', () => {
    at(CartPage, page => {
      page.lineItem(0).quantity.set(2);
      cy.wait(1000);
      page.submitPromotionCode('INTERSHOP');
      page.successMessage.message.should('contain', 'applied');
      page.promotion.should('exist');
    });
  });

  it('user registers and the basket is merged with the promotion code', () => {
    at(CartPage, page => {
      page.header.gotoRegistrationPage();
    });
    at(RegistrationPage, page => {
      page.fillForm(_.user);
      page.acceptTAC();
      page.submitAndObserve().its('response.statusCode').should('equal', 201);
    });
    at(MyAccountPage, page => {
      page.header.miniCart.goToCart();
    });
    at(CartPage, page => {
      page.promotion.should('exist');
    });
  });

  it('user removes a promotion code', () => {
    at(CartPage, page => {
      page.removePromotionCode();
      page.promotion.should('not.exist');
    });
  });
});
