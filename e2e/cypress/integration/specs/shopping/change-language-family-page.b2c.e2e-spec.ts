import { at } from '../../framework';
import { FamilyPage } from '../../pages/shopping/family.page';

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
});
