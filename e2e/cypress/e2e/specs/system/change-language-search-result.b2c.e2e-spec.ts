import { at } from '../../framework';
import { SearchResultPage } from '../../pages/shopping/search-result.page';

const _ = {
  catalog: {
    id: 'Cameras-Camcorders',
    englishName: 'Cameras',
    germanName: 'Kameras',
  },
  product: {
    sku: '457595',
    dollarPrice: '33.75',
    euroPrice: '25,00',
  },
  searchTerm: 'lens',
};

describe('Language Changing User', () => {
  describe('starting at search result page', () => {
    before(() => SearchResultPage.navigateTo(_.searchTerm));

    it('should see dollar prices', () => {
      at(SearchResultPage, page => {
        page.productList.productTile(_.product.sku).should('contain', _.product.dollarPrice).should('contain', '$');
      });
    });

    it('should see english categories', () => {
      at(SearchResultPage, page => {
        page.header.topLevelCategoryLink(_.catalog.id).should('contain', _.catalog.englishName);
      });
    });

    it('when switching to german', () => {
      at(SearchResultPage, page => {
        page.header.switchLanguage('Deutsch');
      });
    });

    it('should see euro prices', () => {
      at(SearchResultPage, page => {
        page.productList.productTile(_.product.sku).should('contain', _.product.euroPrice).should('contain', '€');
      });
    });

    it('should see german categories', () => {
      at(SearchResultPage, page => {
        page.header.topLevelCategoryLink(_.catalog.id).should('contain', _.catalog.germanName);
      });
    });
  });
});
