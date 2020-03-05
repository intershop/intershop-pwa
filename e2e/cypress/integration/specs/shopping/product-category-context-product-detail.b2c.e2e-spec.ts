import { at } from '../../framework';
import { CategoryPage } from '../../pages/shopping/category.page';
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
    defaultCategory: {
      categoryId: 'Computers.225.373.377',
      name: 'Ink Cartridges',
    },
  },
};

describe('Product Category Context', () => {
  describe('directly navigating to product detail page', () => {
    before(() => ProductDetailPage.navigateTo(_.product.sku));

    it('should see the category context of the default category', () => {
      at(ProductDetailPage, page => {
        page.sku.should('contain', _.product.sku);
        page.breadcrumb.items.should('have.length', 6);
        page.breadcrumb.items.eq(4).should('contain', _.product.defaultCategory.name);
        page.breadcrumb.items.eq(5).should('contain', _.product.name);
      });
    });

    describe('and then finding it via bundle category', () => {
      it('should go to bundle category', () => {
        at(ProductDetailPage, page => page.header.gotoCategoryPage(_.bundleCategory.catalog));
        at(CategoryPage, page => page.gotoSubCategory(_.bundleCategory.categoryId));
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
});
