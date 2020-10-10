import { at, waitLoadingEnd } from '../../framework';
import { createUserViaREST } from '../../framework/users';
import { LoginPage } from '../../pages/account/login.page';
import { MyAccountPage } from '../../pages/account/my-account.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { CartPage } from '../../pages/checkout/cart.page';
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

describe('Basket Handling', () => {
  before(() => {
    createUserViaREST(_.user);
    LoginPage.navigateTo();
  });

  it('user adds one product to basket and logs out', () => {
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page.submit().its('response.statusCode').should('equal', 200);
    });
    at(MyAccountPage, page => page.header.gotoCategoryPage(_.catalog));
    at(CategoryPage, page => page.gotoSubCategory(_.category.id));
    at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product.sku));
    at(ProductDetailPage, page => {
      page.addProductToCart().its('response.statusCode').should('equal', 201);
      page.header.miniCart.total.should('contain', _.product.price);
      page.header.logout();
    });
    at(HomePage);
  });

  it('user adds one product to basket anonymously', () => {
    at(HomePage, page => page.header.gotoCategoryPage(_.catalog));
    at(CategoryPage, page => page.gotoSubCategory(_.category.id));
    at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product.sku));
    at(ProductDetailPage, page => {
      page.addProductToCart().its('response.statusCode').should('equal', 201);
      page.header.miniCart.total.should('contain', _.product.price);
      page.header.miniCart.goToCart();
    });
  });

  it('user adds a promotion code that can be applied yet', () => {
    at(CartPage, page => {
      page.lineItem(0).quantity.set(2);
      cy.wait(1000);
      page.collapsePromotionForm();
      page.submitPromotionCode('INTERSHOP');
      page.successMessage.message.should('contain', 'applied');
      page.promotion.should('exist');
    });
  });

  it('user logs in again and baskets should be merged', () => {
    at(CartPage, page => page.header.gotoLoginPage());
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page.submit().its('response.statusCode').should('equal', 200);
      waitLoadingEnd(5000);
    });
    at(MyAccountPage, page => {
      page.header.miniCart.total.should('contain', _.product.price * 3);
      page.header.miniCart.goToCart();
    });
    at(CartPage, page => {
      page.header.miniCart.total.should('contain', _.product.price * 3);
      page.header.miniCart.goToCart();
      page.promotion.should('exist');
    });
  });

  it('user adds one more product to basket when logged in', () => {
    at(CartPage, page => page.header.gotoCategoryPage(_.catalog));
    at(CategoryPage, page => page.gotoSubCategory(_.category.id));
    at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product.sku));
    at(ProductDetailPage, page => {
      page.addProductToCart().its('response.statusCode').should('equal', 200);
      waitLoadingEnd(1000);
      page.header.miniCart.total.should('contain', _.product.price * 4);
    });
    at(CartPage, page => {
      page.lineItem(0).quantity.get().should('equal', 4);
    });
  });

  it('user should get info messages', () => {
    at(CartPage, page => page.header.gotoCategoryPage(_.catalog));
    at(CategoryPage, page => page.gotoSubCategory(_.category.id));
    at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product.sku));
    at(ProductDetailPage, page => {
      page.setQuantity(100);
    });
    at(ProductDetailPage, page => {
      page.addProductToCart().its('response.statusCode').should('equal', 200);
    });

    at(CartPage, page => {
      page.lineItemInfoMessage.message.should('contain', 'The quantity you entered is invalid');
    });
  });

  it('user should get error messages in case an error occurs', () => {
    at(CartPage, page => page.header.gotoCategoryPage(_.catalog));
    at(CategoryPage, page => page.gotoSubCategory(_.category.id));
    at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product.sku));
    at(ProductDetailPage, page => {
      page.addProductToCart().its('response.statusCode').should('equal', 422);
      waitLoadingEnd(1000);
      page.header.miniCart.error.should('contain', 'could not be added');
    });
  });

  it('user should be able to modify the amount of products', () => {
    at(ProductDetailPage, page => page.header.miniCart.goToCart());
    at(CartPage, page => {
      page.lineItems.should('have.length', 1);
      page.lineItem(0).quantity.set(2);
      waitLoadingEnd(2000);
      page.subtotal.should('contain', _.product.price * 2);
      page.lineItem(0).remove();
      waitLoadingEnd(2000);
      page.header.miniCart.text.should('contain', '0 items');
    });
  });
});
