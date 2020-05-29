import { at, back } from '../../framework';
import { FamilyPage } from '../../pages/shopping/family.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';
import { RecentlyViewedPage } from '../../pages/shopping/recently-viewed.page';

const _ = {
  category: {
    id: 'Home-Entertainment.SmartHome',
  },
  product1: {
    sku: '201807171',
  },
  product2: {
    sku: '201807191',
  },
};

describe('Browsing User', () => {
  describe('checking recently viewed functionality', () => {
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
        page.recentlyViewedItem(_.product1.sku).should('be.visible').click();
      });
      at(ProductDetailPage, page => {
        page.sku.should('have.text', _.product1.sku);
      });
    });

    it('should see second product in recent items and follow link to first product again', () => {
      at(ProductDetailPage, page => {
        page.recentlyViewedItems.should('have.length', 1);
        page.recentlyViewedItem(_.product2.sku).should('be.visible').click();
      });
      at(ProductDetailPage, page => {
        page.sku.should('have.text', _.product2.sku);
      });
    });

    it('should see "View All" link and follow the link to the browsing history page', () => {
      at(ProductDetailPage, page => {
        page.gotoRecentlyViewedViewAll();
      });
      at(RecentlyViewedPage, page => {
        page.recentlyViewedItems.should('have.length', 2);
      });
    });

    it('should see "Clear My History" link and use it to clear the browsing history', () => {
      at(RecentlyViewedPage, page => {
        page.clearAllRecentlyViewedItems();
        page.recentlyViewedItems.should('have.length', 0);
      });
    });
  });
});
