import { at } from '../../framework';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  catalog: {
    id: 'Cameras-Camcorders',
    englishName: 'Cameras',
    germanName: 'Kameras',
  },
  category: 'Cameras-Camcorders.585',
  product: {
    sku: '457595',
    dollarPrice: '35.78',
    euroPrice: '26,50',
  },
};

describe('Language Changing User', () => {
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
});
