import { at } from '../../framework';
import { FamilyPage } from '../../pages/shopping/family.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  bundleCategory: {
    categoryId: 'Specials.HotDeals',
    catalog: 'Specials',
    name: 'Hot Deals',
  },
  product: {
    sku: '872843',
    name: 'Epson Multipack',
  },
};

describe('Product Category Context', () => {
  describe('located under bundle category', () => {
    before(() => FamilyPage.navigateTo(_.bundleCategory.categoryId));

    it('should find the product on family page', () => {
      at(FamilyPage, page => page.productList.productTile(_.product.sku).should('contain', _.product.name));
    });

    it('should follow to product detail page and see the category context of the bundle category', () => {
      at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product.sku));
      at(ProductDetailPage, page => {
        page.sku.should('contain', _.product.sku);
        page.breadcrumb.items.should('have.length', 4);
        page.breadcrumb.items.eq(2).should('contain', _.bundleCategory.name);
        page.breadcrumb.items.eq(3).should('contain', _.product.name);
      });
    });
  });
});
