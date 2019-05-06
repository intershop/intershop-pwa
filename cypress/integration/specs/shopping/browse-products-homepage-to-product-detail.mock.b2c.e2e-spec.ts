import { at } from '../../framework';
import { HomePage } from '../../pages/home.page';
import { CategoryPage } from '../../pages/shopping/category.page';
import { FamilyPage } from '../../pages/shopping/family.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  catalog: 'Cameras-Camcorders',
  category: {
    id: 'Cameras-Camcorders.584',
  },
  product: {
    sku: '3953312',
    price: '$303.62',
  },
};

describe('Browsing User', () => {
  describe('starting at home page', () => {
    before(() => HomePage.navigateTo());

    it('should see featured products on home page', () => {
      at(HomePage, page => {
        page.featuredProducts.should('have.length', 4);
      });
    });

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
        page.productList.gotoProductDetailPageBySku(_.product.sku);
      });
      at(ProductDetailPage, page => {
        page.sku.should('have.text', _.product.sku);
        page.price.should('contain', _.product.price);
      });
    });
  });
});
