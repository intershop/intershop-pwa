import { at } from '../../framework';
import { createUserViaREST } from '../../framework/users';
import { LoginPage } from '../../pages/account/login.page';
import { MyAccountPage } from '../../pages/account/my-account.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
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

describe('Returning User with Basket', () => {
  xdescribe('anonymous user', () => {
    it('should add product to basket', () => {
      ProductDetailPage.navigateTo(_.product.sku);
      at(ProductDetailPage, page => {
        page
          .addProductToCart()
          .its('status')
          .should('equal', 201);
        page.header.miniCart.total.should('contain', _.product.price);
      });
    });

    it('should refresh page and still have basket', () => {
      Cypress.Cookies.preserveOnce('apiToken');
      HomePage.navigateTo();
      at(HomePage, page => page.header.miniCart.total.should('contain', _.product.price));
    });
  });

  describe('authenticated user', () => {
    before(() => {
      createUserViaREST(_.user);
      LoginPage.navigateTo();
    });

    beforeEach(() => Cypress.Cookies.preserveOnce('apiToken'));

    it('should log in', () => {
      at(LoginPage, page => {
        page.fillForm(_.user.login, _.user.password);
        page
          .submit()
          .its('status')
          .should('equal', 200);
      });
    });

    it('should navigate to product and add it to cart', () => {
      at(MyAccountPage, page => page.header.gotoCategoryPage(_.catalog));
      at(CategoryPage, page => page.gotoSubCategory(_.category.id));
      at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product.sku));
      at(ProductDetailPage, page => {
        page
          .addProductToCart()
          .its('status')
          .should('equal', 201);
        page.header.miniCart.total.should('contain', _.product.price);
      });
    });

    it('should refresh page and still have basket', () => {
      HomePage.navigateTo();
      at(HomePage, page => page.header.miniCart.total.should('contain', _.product.price));
    });
  });
});
