import { at, back } from '../framework';
import { HomePage } from '../pages/home.page';
import { CategoryPage } from '../pages/shopping/category.page';
import { FamilyPage } from '../pages/shopping/family.page';
import { ProductDetailPage } from '../pages/shopping/product-detail.page';

const _ = {
  catalog: 'Cameras-Camcorders',
  category: {
    id: 'Cameras-Camcorders.584',
    name: 'Camcorders',
  },
  product1: {
    sku: '3953312',
    price: '$303.62',
  },
  product2: {
    sku: '7912061',
  },
};

describe('Browsing User', () => {
  describe('starting at home page', () => {
    before(() => HomePage.navigateTo());

    it(`should go from home page to category page`, () => {
      at(HomePage, page => {
        page.header.gotoCategoryPage(_.catalog);
      });
    });

    it(`should navigate through sub categories to family page`, () => {
      at(CategoryPage, page => {
        page.subCategories.should('have.length.gte', 1);
        page.gotoSubCategory(_.category.id);
      });
      at(FamilyPage, page => {
        page.productList.visibleProducts.should('have.length.gte', 2);
      });
    });

    it(`should end on product detail page to check product price`, () => {
      at(FamilyPage, page => {
        page.productList.gotoProductDetailPageBySku(_.product1.sku);
      });
      at(ProductDetailPage, page => {
        page.sku.should('have.text', _.product1.sku);
        page.price.should('contain', _.product1.price);
      });
    });
  });

  describe('starting at product detail page', () => {
    before(() => {
      ProductDetailPage.navigateTo(_.category.id, _.product1.sku);
    });

    it('should be at product detail page to check product price', () => {
      at(ProductDetailPage, page => {
        page.sku.should('have.text', _.product1.sku);
        page.price.should('contain', _.product1.price);
      });
    });

    it('should navigate to family page to check sibling products', () => {
      at(ProductDetailPage, page => {
        page.breadcrumb.items.should('have.length', 4);
        page.breadcrumb.items
          .eq(2)
          .should('have.text', `${_.category.name}/`)
          .click();
      });

      at(FamilyPage, page => {
        page.productList.visibleProducts.should('have.length.gte', 2);
      });
    });
  });

  describe('starting at family page', () => {
    before(() => {
      FamilyPage.navigateTo(_.category.id);
    });

    it(`should select one product to view details`, () => {
      at(FamilyPage, page => {
        page.productList.gotoProductDetailPageBySku(_.product1.sku);
      });
      at(ProductDetailPage, page => {
        page.sku.should('have.text', _.product1.sku);
      });
    });

    it('should tap browser back button and be at family page again', () => {
      back();
      at(FamilyPage);
    });

    it(`should select second product to view details`, () => {
      at(FamilyPage, page => {
        page.productList.gotoProductDetailPageBySku(_.product2.sku);
      });
      at(ProductDetailPage, page => {
        page.sku.should('have.text', _.product2.sku);
      });
    });

    it('should see first product in recent items and follow link to second product', () => {
      at(ProductDetailPage, page => {
        page.recentlyViewedItems.should('have.length', 1);
        page
          .recentlyViewedItem(_.product1.sku)
          .should('be.visible')
          .click();
      });
      at(ProductDetailPage, page => {
        page.sku.should('have.text', _.product1.sku);
      });
    });

    it('should see second product in recent items and follow link to first product again', () => {
      at(ProductDetailPage, page => {
        page.recentlyViewedItems.should('have.length', 1);
        page
          .recentlyViewedItem(_.product2.sku)
          .should('be.visible')
          .click();
      });
      at(ProductDetailPage, page => {
        page.sku.should('have.text', _.product2.sku);
      });
    });
  });
});
