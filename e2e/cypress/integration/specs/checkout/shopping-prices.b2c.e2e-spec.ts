import { at } from '../../framework';
import { createUserViaREST } from '../../framework/users';
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

describe('Price Display B2C', () => {
  before(() => {
    createUserViaREST(_.user);

    ProductDetailPage.navigateTo(_.product.sku);
  });

  it('should display gross price on PDP', () => {
    at(ProductDetailPage, page => page.price.should('contain', (_.product.priceNet + _.product.tax).toFixed(2)));
  });

  it('adding to cart should display with tax', () => {
    at(ProductDetailPage, page => {
      page.addProductToCart();
      page.header.miniCart.total.should('contain', (_.product.priceNet + _.product.tax).toFixed(2));
    });
  });

  it('should display tax on cart page', () => {
    at(ProductDetailPage, page => page.header.miniCart.goToCart());
    at(CartPage, page => {
      page.subtotal.should('contain', (_.product.priceNet + _.product.tax).toFixed(2));
      page.tax.should('contain', (_.product.tax + _.product.shippingTax).toFixed(2));
    });
  });

  it('when logging in', () => {
    at(CartPage, page => page.header.gotoLoginPage());
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page.submit().its('response.statusCode').should('equal', 200);
    });
  });

  it('should see the same prices', () => {
    at(MyAccountPage, page => page.header.miniCart.goToCart());
    at(CartPage, page => {
      page.subtotal.should('contain', (_.product.priceNet + _.product.tax).toFixed(2));
      page.tax.should('contain', (_.product.tax + _.product.shippingTax).toFixed(2));
    });
  });
});
