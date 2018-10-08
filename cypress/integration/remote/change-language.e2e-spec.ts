import { at } from '../framework';
import { HomePage } from '../pages/home.page';
import { FamilyPage } from '../pages/shopping/family.page';
import { ProductDetailPage } from '../pages/shopping/product-detail.page';

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
    before(() => ProductDetailPage.navigateTo(_.category, _.product.sku));

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

    xit('when switching to german', () => {
      at(ProductDetailPage, page => {
        page.header.switchLanguage('German');
      });
    });

    xit('should see euro prices', () => {
      at(ProductDetailPage, page => {
        page.price.should('contain', _.product.euroPrice).should('contain', '€');
      });
    });

    xit('should see german categories', () => {
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

    xit('when switching to german', () => {
      at(FamilyPage, page => {
        page.header.switchLanguage('German');
      });
    });

    xit('should see euro prices', () => {
      at(FamilyPage, page => {
        page.productList
          .productTile(_.product.sku)
          .should('contain', _.product.euroPrice)
          .should('contain', '€');
      });
    });

    xit('should see german categories', () => {
      at(FamilyPage, page => {
        page.header.topLevelCategoryLink(_.catalog.id).should('contain', _.catalog.germanName);
      });
    });
  });
});
