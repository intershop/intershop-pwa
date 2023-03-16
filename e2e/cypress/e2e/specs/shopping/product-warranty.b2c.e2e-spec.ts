import { at, waitLoadingEnd } from '../../framework';
import { createUserViaREST } from '../../framework/users';
import { LoginPage } from '../../pages/account/login.page';
import { MyAccountPage } from '../../pages/account/my-account.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { CartPage } from '../../pages/checkout/cart.page';
import { CheckoutPaymentPage } from '../../pages/checkout/checkout-payment.page';
import { CheckoutReviewPage } from '../../pages/checkout/checkout-review.page';
import { HomePage } from '../../pages/home.page';
import { CategoryPage } from '../../pages/shopping/category.page';
import { FamilyPage } from '../../pages/shopping/family.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  product1: {
    sku: '5777062',
    price: 614.0,
    index: 0,
  },
  product2: {
    sku: '4747809',
    price: 513.25,
    index: 1,
  },
  featuredProduct: {
    sku: '201807171',
    index: 2,
  },
  noWarrantyValue: '',
  selectedWarranty: {
    sku: '1YLEDTVSUP',
    name: '1-year LED TV Support',
    price: 100.0,
  },
  user: {
    login: `test${new Date().getTime()}@testcity.de`,
    ...sensibleDefaults,
  },
  totalPrice: '1,327.25',
  totalPrice2: '1,227.25',
  catalog: 'Home-Entertainment',
  category1: 'Home-Entertainment.220',
  category2: 'Home-Entertainment.220.1584',
};

describe('Product Warranty B2C', () => {
  describe('starting at product detail page', () => {
    before(() => ProductDetailPage.navigateTo(_.product1.sku));

    it('should have warranty component', () => {
      at(ProductDetailPage, page => page.warranties.should('exist'));
    });

    it('add product with selected warranty to cart', () => {
      at(ProductDetailPage, page => {
        page.selectWarranty(_.selectedWarranty.sku);
        page.addProductToCart().its('response.statusCode').should('equal', 201);
        waitLoadingEnd();
        page.header.miniCart.goToCart();
      });
    });

    it('product in cart should have the selected warranty', () => {
      at(CartPage, page => {
        page.lineItems.should('have.length', 1);
        page.lineItem(_.product1.index).warranty.get().should('have.value', _.selectedWarranty.sku);
      });
    });
  });

  describe('add product without a selected warranty to cart', () => {
    it('add product without warranty to cart', () => {
      at(CartPage, page => page.header.gotoCategoryPage(_.catalog));
      at(CategoryPage, page => page.gotoSubCategory(_.category1));
      at(CategoryPage, page => page.gotoSubCategory(_.category2));
      at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product2.sku));
      at(ProductDetailPage, page => {
        page.warranties.should('exist');
        page.addProductToCart().its('response.statusCode').should('equal', 201);
        waitLoadingEnd();
        page.header.miniCart.goToCart();
      });
    });

    it('product in cart should have a select-box with no selected warranty', () => {
      at(CartPage, page => {
        page.lineItems.should('have.length', 2);
        page.lineItem(_.product2.index).warranty.get().should('have.value', _.noWarrantyValue);
      });
    });

    it('changing a warranty should update the cart total', () => {
      at(CartPage, page => {
        page.lineItem(_.product2.index).warranty.set(_.selectedWarranty.sku);
        waitLoadingEnd();
        page.lineItem(_.product2.index).warranty.get().should('have.value', _.selectedWarranty.sku);
        page.subtotal.should('contain', _.totalPrice);
      });
    });

    it('removing a warranty should update the cart total', () => {
      at(CartPage, page => {
        page.lineItem(_.product1.index).warranty.set(_.noWarrantyValue);
        waitLoadingEnd();
        // page.subtotal.should('contain', _.totalPrice2);
      });
    });
  });

  describe('add product that has no warranty to cart', () => {
    it('should not show a warranty-select-box in the cart when adding a product without a warranty', () => {
      at(CartPage, page => page.header.gotoHomePage());
      at(HomePage, page => page.gotoFeaturedProduct(_.featuredProduct.sku));
      at(ProductDetailPage, page => {
        page.addProductToCart().its('response.statusCode').should('equal', 201);
        waitLoadingEnd();
        page.header.miniCart.goToCart();
      });
      at(CartPage, page => {
        page.lineItems.should('have.length', 3);
        page.lineItem(_.featuredProduct.index).warranty.get().should('not.exist');
      });
    });
  });

  describe('Checkout with a logged-in user', () => {
    before(() => createUserViaREST(_.user));

    it('logging in after adding products to the cart should keep their selected warranties', () => {
      at(CartPage, page => page.header.gotoLoginPage());
      at(LoginPage, page => {
        page.fillForm(_.user.login, _.user.password);
        page.submit().its('response.statusCode').should('equal', 200);
        waitLoadingEnd();
      });
      at(MyAccountPage, page => page.header.miniCart.goToCart());
      at(CartPage, page => {
        page.lineItems.should('have.length', 3);
        page.lineItem(_.product1.index).warranty.get().should('have.value', _.noWarrantyValue);
        page.lineItem(_.product2.index).warranty.get().should('have.value', _.selectedWarranty.sku);
      });
    });

    it('review page should show selected warranties', () => {
      at(CartPage, page => page.beginCheckout());
      at(CheckoutPaymentPage, page => {
        page.selectPayment('INVOICE');
        page.continueCheckout();
      });
      at(CheckoutReviewPage, page =>
        page.lineItemWarranty(_.product2.index).should('contain', _.selectedWarranty.name)
      );
    });
  });
});
