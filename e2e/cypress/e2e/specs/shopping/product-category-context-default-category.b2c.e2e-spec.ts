import { at } from '../../framework';
import { FamilyPage } from '../../pages/shopping/family.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

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
  describe('located under default category', () => {
    before(() => FamilyPage.navigateTo(_.product.defaultCategory.categoryId));

    it('should see the product on the family page', () => {
      at(FamilyPage, page => {
        page.productList.makeAllProductsVisible();
        page.productList.productTile(_.product.sku).should('contain', _.product.name);
      });
    });

    it('should follow to product detail page and see the category context of the default category', () => {
      at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product.sku));
      at(ProductDetailPage, page => {
        page.sku.should('contain', _.product.sku);
        page.breadcrumb.items.should('have.length', 6);
        page.breadcrumb.items.eq(4).should('contain', _.product.defaultCategory.name);
        page.breadcrumb.items.eq(5).should('contain', _.product.name);
      });
    });
  });
});
