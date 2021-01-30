import { at, waitLoadingEnd } from '../../framework';
import { createUserViaREST } from '../../framework/users';
import { LoginPage } from '../../pages/account/login.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { CartPage } from '../../pages/checkout/cart.page';
import { CheckoutAddressesPage } from '../../pages/checkout/checkout-addresses.page';
import { CheckoutPaymentPage } from '../../pages/checkout/checkout-payment.page';
import { CheckoutReceiptPage } from '../../pages/checkout/checkout-receipt.page';
import { CheckoutReviewPage } from '../../pages/checkout/checkout-review.page';
import { CheckoutShippingPage } from '../../pages/checkout/checkout-shipping.page';
import { HomePage } from '../../pages/home.page';
import { CategoryPage } from '../../pages/shopping/category.page';
import { FamilyPage } from '../../pages/shopping/family.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  user: {
    login: `test${new Date().getTime()}@testcity.de`,
    ...sensibleDefaults,
  },
  catalog: 'Home-Entertainment',
  category: {
    id: 'Home-Entertainment.SmartHome',
    name: 'Smart Home',
  },
  product: {
    sku: '201807171',
    price: 185.5,
  },
};

describe('Shopping User', () => {
  before(() => {
    HomePage.navigateTo();
  });

  describe('shopping anonymous', () => {
    it('should navigate to a product', () => {
      at(HomePage, page => page.header.gotoCategoryPage(_.catalog));
      at(CategoryPage, page => page.gotoSubCategory(_.category.id));
      at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product.sku));
      at(ProductDetailPage, page => {
        page.sku.should('have.text', _.product.sku);
        page.price.should('contain', _.product.price);
      });
    });

    it('should add the product to cart', () => {
      at(ProductDetailPage, page => {
        page.addProductToCart().its('response.statusCode').should('equal', 201);
        page.header.miniCart.total.should('contain', _.product.price);
        page.header.miniCart.goToCart();
      });
      at(CartPage);
    });
  });

  describe('continuing logged in', () => {
    before(() => {
      at(CartPage);
      createUserViaREST(_.user);
    });

    it('should start checkout by logging in', () => {
      at(CartPage, page => page.beginCheckout());
      at(LoginPage, page => {
        page.fillForm(_.user.login, _.user.password);
        page.submit().its('response.statusCode').should('equal', 200);
      });
    });

    it('should set first addresses automatically', () => {
      at(CheckoutAddressesPage, page => {
        waitLoadingEnd(3000);
        page.continueCheckout();
      });
    });

    it('should accept default shipping option', () => {
      at(CheckoutShippingPage, page => page.continueCheckout());
    });

    it('should select invoice payment', () => {
      at(CheckoutPaymentPage, page => {
        page.selectPayment('INVOICE');
        page.continueCheckout();
      });
    });

    it('should review order and submit', () => {
      at(CheckoutReviewPage, page => {
        page.acceptTAC();
        page.submitOrder();
      });
    });

    it('should check the receipt and continue shopping', () => {
      at(CheckoutReceiptPage, page => {
        page.continueShopping();
      });
      at(HomePage);
    });
  });
});
