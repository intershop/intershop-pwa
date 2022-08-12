import { at, waitLoadingEnd } from '../../framework';
import { createB2BUserViaREST } from '../../framework/b2b-user';
import { LoginPage } from '../../pages/account/login.page';
import { MyAccountPage } from '../../pages/account/my-account.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { CartPage } from '../../pages/checkout/cart.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  user: {
    login: `test${new Date().getTime()}@testcity.de`,
    ...sensibleDefaults,
  },
  product: {
    sku: '3468826',
    priceNet: 19.5,
    tax: 1.17,
    shippingTax: 0.18,
  },
};

describe('Price Display B2B', () => {
  before(() => {
    createB2BUserViaREST(_.user);

    ProductDetailPage.navigateTo(_.product.sku);
  });

  it('should display net price on PDP', () => {
    at(ProductDetailPage, page => page.price.should('contain', _.product.priceNet));
  });

  it('adding to cart should display without tax', () => {
    at(ProductDetailPage, page => {
      page.addProductToCart();
      page.header.miniCart.total.should('contain', _.product.priceNet);
    });
  });

  it('should display tax on cart page', () => {
    at(ProductDetailPage, page => page.header.miniCart.goToCart());
    at(CartPage, page => {
      page.subtotal.should('contain', _.product.priceNet);
      page.tax.should('contain', (_.product.tax + _.product.shippingTax).toFixed(2));
    });
  });

  it('when logging in', () => {
    at(CartPage, page => page.header.gotoLoginPage());
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page.submit().its('response.statusCode').should('equal', 200);
    });
    waitLoadingEnd();
  });

  it('should see the same prices', () => {
    at(MyAccountPage, page => page.header.miniCart.goToCart());
    at(CartPage, page => {
      page.subtotal.should('contain', _.product.priceNet);
      page.tax.should('contain', (_.product.tax + _.product.shippingTax).toFixed(2));
    });
  });
});
