import { at } from '../../framework';
import { FamilyPage } from '../../pages/shopping/family.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  category: {
    id: 'Cameras-Camcorders.584',
    name: 'Camcorders',
  },
  product: {
    sku: '3953312',
    price: '$303.62',
  },
};

describe('Browsing User', () => {
  describe('starting at product detail page', () => {
    before(() => {
      ProductDetailPage.navigateTo(_.product.sku, _.category.id);
    });

    it('should be at product detail page to check product price', () => {
      at(ProductDetailPage, page => {
        page.sku.should('have.text', _.product.sku);
        page.price.should('contain', _.product.price);
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
});
