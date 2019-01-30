import { at } from '../framework';
import { createUserViaREST } from '../framework/users';
import { LoginPage } from '../pages/account/login.page';
import { MyAccountPage } from '../pages/account/my-account.page';
import { Registration, sensibleDefaults } from '../pages/account/registration.page';
import { HomePage } from '../pages/home.page';
import { FamilyPage } from '../pages/shopping/family.page';
import { ProductDetailPage } from '../pages/shopping/product-detail.page';
import { SearchResultPage } from '../pages/shopping/search-result.page';

const _ = {
  catalog: {
    id: 'Cameras-Camcorders',
    englishName: 'Cameras',
    germanName: 'Kameras',
  },
  category: 'Cameras-Camcorders.584',
  product: {
    sku: '3953312',
    dollarPrice: '303.62',
    euroPrice: '227,05',
  },
  myAccount: {
    englishTitle: 'My Account',
    germanTitle: 'Mein Konto',
  },
  searchTerm: 'canon legria',
  user: {
    ...sensibleDefaults,
    login: `testuser${new Date().getTime()}@test.intershop.de`,
    firstName: 'Peter',
    lastName: 'Parker',
  } as Registration,
};

describe('Language Changing User', () => {
  describe('starting at home page', () => {
    before(() => HomePage.navigateTo());

    it('should see english categories', () => {
      at(HomePage, page => {
        page.header.topLevelCategoryLink(_.catalog.id).should('contain', _.catalog.englishName);
      });
    });

    it('when switching to german', () => {
      at(HomePage, page => {
        page.header.switchLanguage('German');
      });
    });

    it('should see german categories', () => {
      at(HomePage, page => {
        page.header.topLevelCategoryLink(_.catalog.id).should('contain', _.catalog.germanName);
      });
    });
  });

  describe('starting at product detail page', () => {
    before(() => ProductDetailPage.navigateTo(_.product.sku, _.category));

    it('should see dollar prices', () => {
      at(ProductDetailPage, page => {
        page.price.should('contain', _.product.dollarPrice).should('contain', '$');
      });
    });

    it('should see english categories', () => {
      at(ProductDetailPage, page => {
        page.header.topLevelCategoryLink(_.catalog.id).should('contain', _.catalog.englishName);
      });
    });

    it('when switching to german', () => {
      at(ProductDetailPage, page => {
        page.header.switchLanguage('German');
      });
    });

    it('should see euro prices', () => {
      at(ProductDetailPage, page => {
        page.price.should('contain', _.product.euroPrice).should('contain', '€');
      });
    });

    it('should see german categories', () => {
      at(ProductDetailPage, page => {
        page.header.topLevelCategoryLink(_.catalog.id).should('contain', _.catalog.germanName);
      });
    });
  });

  describe('starting at family page', () => {
    before(() => FamilyPage.navigateTo(_.category));

    it('should see dollar prices', () => {
      at(FamilyPage, page => {
        page.productList
          .productTile(_.product.sku)
          .should('contain', _.product.dollarPrice)
          .should('contain', '$');
      });
    });

    it('should see english categories', () => {
      at(FamilyPage, page => {
        page.header.topLevelCategoryLink(_.catalog.id).should('contain', _.catalog.englishName);
      });
    });

    it('when switching to german', () => {
      at(FamilyPage, page => {
        page.header.switchLanguage('German');
      });
    });

    it('should see euro prices', () => {
      at(FamilyPage, page => {
        page.productList
          .productTile(_.product.sku)
          .should('contain', _.product.euroPrice)
          .should('contain', '€');
      });
    });

    it('should see german categories', () => {
      at(FamilyPage, page => {
        page.header.topLevelCategoryLink(_.catalog.id).should('contain', _.catalog.germanName);
      });
    });
  });

  describe('starting at search result page', () => {
    before(() => SearchResultPage.navigateTo(_.searchTerm));

    it('should see dollar prices', () => {
      at(SearchResultPage, page => {
        page.productList
          .productTile(_.product.sku)
          .should('contain', _.product.dollarPrice)
          .should('contain', '$');
      });
    });

    it('should see english categories', () => {
      at(SearchResultPage, page => {
        page.header.topLevelCategoryLink(_.catalog.id).should('contain', _.catalog.englishName);
      });
    });

    it('when switching to german', () => {
      at(SearchResultPage, page => {
        page.header.switchLanguage('German');
      });
    });

    it('should see euro prices', () => {
      at(SearchResultPage, page => {
        page.productList
          .productTile(_.product.sku)
          .should('contain', _.product.euroPrice)
          .should('contain', '€');
      });
    });

    it('should see german categories', () => {
      at(SearchResultPage, page => {
        page.header.topLevelCategoryLink(_.catalog.id).should('contain', _.catalog.germanName);
      });
    });
  });

  describe('when logged in', () => {
    before(() => LoginPage.navigateTo());

    it('should log in', () => {
      createUserViaREST(_.user);
      at(LoginPage, page =>
        page
          .fillForm(_.user.login, _.user.password)
          .submit()
          .its('status')
          .should('equal', 200)
      );
      at(MyAccountPage, page =>
        page.header.myAccountLink.should('have.text', `${_.user.firstName} ${_.user.lastName}`)
      );
    });

    it('when switching to german', () => {
      at(MyAccountPage, page => {
        page.header.switchLanguage('German');
      });
    });

    xit('should still be logged in', () => {
      at(MyAccountPage, page =>
        page.header.myAccountLink.should('have.text', `${_.user.firstName} ${_.user.lastName}`)
      );
    });
  });

  describe('when accessing protected content', () => {
    before(() => MyAccountPage.navigateTo());

    it('should see english content on login page', () => {
      at(LoginPage, page => page.content.should('contain', _.myAccount.englishTitle));
    });

    it('when switching to german', () => {
      at(LoginPage, page => page.header.switchLanguage('German'));
    });

    it('should see german content on login page', () => {
      at(LoginPage, page => page.content.should('contain', _.myAccount.germanTitle));
    });
  });
});
