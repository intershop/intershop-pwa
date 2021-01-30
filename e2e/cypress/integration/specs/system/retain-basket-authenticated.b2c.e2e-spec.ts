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

describe('Returning User with Basket', () => {
  describe('authenticated user', () => {
    before(() => {
      createUserViaREST(_.user);
      LoginPage.navigateTo();
    });

    it('should log in', () => {
      at(LoginPage, page => {
        page.fillForm(_.user.login, _.user.password);
        page.submit().its('response.statusCode').should('equal', 200);
      });
    });

    it('should navigate to product and add it to cart', () => {
      at(MyAccountPage, page => page.header.gotoCategoryPage(_.catalog));
      at(CategoryPage, page => page.gotoSubCategory(_.category.id));
      at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product.sku));
      at(ProductDetailPage, page => {
        page.addProductToCart().its('response.statusCode').should('equal', 201);
        page.header.miniCart.total.should('contain', _.product.price);
      });
    });

    it('should refresh page and still have basket', () => {
      HomePage.navigateTo();
      at(HomePage, page => page.header.miniCart.total.should('contain', _.product.price));
    });
  });
});
