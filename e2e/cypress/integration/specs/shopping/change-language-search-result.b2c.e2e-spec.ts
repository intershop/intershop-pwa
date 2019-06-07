import { at } from '../../framework';
import { SearchResultPage } from '../../pages/shopping/search-result.page';

const _ = {
  catalog: {
    id: 'Cameras-Camcorders',
    englishName: 'Cameras',
    germanName: 'Kameras',
  },
  product: {
    sku: '3953312',
    dollarPrice: '303.62',
    euroPrice: '227,05',
  },
  searchTerm: 'canon legria',
};

describe('Language Changing User', () => {
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
});
