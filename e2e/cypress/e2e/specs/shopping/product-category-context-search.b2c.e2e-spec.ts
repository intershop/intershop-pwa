import { at } from '../../framework';
import { HomePage } from '../../pages/home.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';
import { SearchResultPage } from '../../pages/shopping/search-result.page';

const _ = {
  product: {
    sku: '872843',
    name: 'Epson Multipack',
    defaultCategory: {
      categoryId: 'Computers.225.373.377',
      name: 'Ink Cartridges',
    },
  },
};

describe('Product Category Context', () => {
  describe('when searching for the product', () => {
    before(() => HomePage.navigateTo());

    it('should search for the product', () => {
      at(HomePage, page => page.header.searchBox.search(_.product.name));
    });

    it('should find the product on search result page', () => {
      at(SearchResultPage, page => page.productList.productTile(_.product.sku).should('contain', _.product.name));
    });

    it('should follow to product detail page and see the category context of the default category', () => {
      at(SearchResultPage, page => page.productList.gotoProductDetailPageBySku(_.product.sku));
      at(ProductDetailPage, page => {
        page.sku.should('contain', _.product.sku);
        page.breadcrumb.items.should('have.length', 6);
        page.breadcrumb.items.eq(4).should('contain', _.product.defaultCategory.name);
        page.breadcrumb.items.eq(5).should('contain', _.product.name);
      });
    });
  });
});
