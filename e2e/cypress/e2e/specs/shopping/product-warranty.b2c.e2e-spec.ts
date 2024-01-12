import { at, waitLoadingEnd } from '../../framework';
import { createUserViaREST } from '../../framework/users';
import { LoginPage } from '../../pages/account/login.page';
import { MyAccountPage } from '../../pages/account/my-account.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { CartPage } from '../../pages/checkout/cart.page';
import { CheckoutPaymentPage } from '../../pages/checkout/checkout-payment.page';
import { CheckoutReceiptPage } from '../../pages/checkout/checkout-receipt.page';
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
  describe('product with available warranties', () => {
    before(() => ProductDetailPage.navigateTo(_.product1.sku));

    it('displays available warranties', () => {
      at(ProductDetailPage, page => page.warranties.should('exist'));
    });

    it('adds product with selected warranty to cart', () => {
      at(ProductDetailPage, page => {
        page.selectWarranty(_.selectedWarranty.sku);
        page.addProductToCart().its('response.statusCode').should('equal', 201);
        waitLoadingEnd();
        page.header.miniCart.goToCart();
      });
    });

    it('shows the selected warranty at the cart item', () => {
      at(CartPage, page => {
        page.lineItems.should('have.length', 1);
        page.lineItem(_.product1.index).warranty.get().should('have.value', _.selectedWarranty.sku);
      });
    });

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
        // doesn't work with current icm, doesn't change the total price when no warranty is selected
        page.subtotal.should('contain', _.totalPrice2);
      });
    });
  });

  describe('product without avaiable warranties', () => {
    it('does not show a warranty-select-box in the cart for this product', () => {
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

  describe('checkout products as a logged-in user', () => {
    before(() => createUserViaREST(_.user));

    it('merges the existing cart items together with the selected warranties after logging in', () => {
      at(CartPage, page => page.header.gotoLoginPage());
      at(LoginPage, page => {
        page.fillForm(_.user.login, _.user.password);
        page.submit().its('response.statusCode').should('equal', 200);
        waitLoadingEnd();
      });
      at(MyAccountPage, page => page.header.miniCart.goToCart());
      at(CartPage, page => {
        page.lineItems.should('have.length', 3);
        // activate these tests if merge sorting issue has been fixed, see #92412
        // page.lineItem(_.product1.index).warranty.get().should('have.value', _.noWarrantyValue);
        // page.lineItem(_.product2.index).warranty.get().should('have.value', _.selectedWarranty.sku);
      });
    });

    it('shows selected warranties on checkout review page', () => {
      at(CartPage, page => page.beginCheckout());
      at(CheckoutPaymentPage, page => {
        page.selectPayment('INVOICE');
        page.continueCheckout();
      });
      at(CheckoutReviewPage, page => {
        page.lineItemWarranty().should('contain', _.selectedWarranty.name);
      });
    });

    it('shows the selected warranties on checkout receipt page', () => {
      at(CheckoutReviewPage, page => {
        page.acceptTAC();
        page.submitOrder();
      });
      at(CheckoutReceiptPage, page => {
        page.lineItemWarranty().should('contain', _.selectedWarranty.name);
      });
    });
  });
});
