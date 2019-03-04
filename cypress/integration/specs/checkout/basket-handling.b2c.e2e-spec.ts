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
  catalog: 'Cameras-Camcorders',
  category: {
    id: 'Cameras-Camcorders.584',
    name: 'Camcorders',
  },
  product: {
    sku: '3953312',
    price: 303.62,
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
      page
        .submit()
        .its('status')
        .should('equal', 200);
    });
    at(MyAccountPage, page => page.header.gotoCategoryPage(_.catalog));
    at(CategoryPage, page => page.gotoSubCategory(_.category.id));
    at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product.sku));
    at(ProductDetailPage, page => {
      page.addProductToCart();
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
      page.addProductToCart();
      page.header.miniCart.total.should('contain', _.product.price);
    });
  });

  it('user logs in again and baskets should be merged', () => {
    at(ProductDetailPage, page => page.header.gotoLoginPage());
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page
        .submit()
        .its('status')
        .should('equal', 200);
    });
    at(MyAccountPage, page => page.header.miniCart.total.should('contain', _.product.price * 2));
  });

  it('user adds one more product to basket when logged in', () => {
    at(MyAccountPage, page => page.header.gotoCategoryPage(_.catalog));
    at(CategoryPage, page => page.gotoSubCategory(_.category.id));
    at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product.sku));
    at(ProductDetailPage, page => {
      page.addProductToCart();
      page.header.miniCart.total.should('contain', _.product.price * 3);
    });
  });

  it('user should be able to modify the amount of products', () => {
    at(ProductDetailPage, page => page.header.miniCart.goToCart());
    at(CartPage, page => {
      page.lineItems.should('have.length', 1);
      page.summary.subtotal.should('contain', _.product.price * 3);
      page.lineItem(0).quantity.set(2);
      waitLoadingEnd();
      page.summary.subtotal.should('contain', _.product.price * 2);
      page.lineItem(0).remove();
      waitLoadingEnd();
      page.header.miniCart.text.should('contain', '0 items');
    });
  });
});
