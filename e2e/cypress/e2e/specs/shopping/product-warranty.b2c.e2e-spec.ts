import { at } from '../../framework';
import { CartPage } from '../../pages/checkout/cart.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  product1: {
    sku: '5777062',
    price: 614.0,
    index: 0,
  },
  product2: {
    sku: '4747809',
    price: 513.25,
    index: 1,
  },
  selectedWarranty: {
    sku: '1YLEDTVSUP',
    price: 100.0,
  },
  noWarrantyValue: '',
  // category: 'Home-Entertainment.220.1584',
};

describe('Product Warranty B2C', () => {
  describe('starting at product detail page', () => {
    before(() => ProductDetailPage.navigateTo(_.product1.sku));

    it('should have warranty component', () => {
      at(ProductDetailPage, page => page.warranties.should('exist'));
    });

    it('add product with selected warranty to cart', () => {
      at(ProductDetailPage, page => {
        page.selectWarranty(_.selectedWarranty.sku);
        page.addProductToCart();
        page.header.miniCart.goToCart();
      });
    });

    it('product in cart should have the selected warranty', () => {
      at(CartPage, page => {
        page.lineItems.should('have.length', 1);
        page.lineItem(_.product1.index).warranties.should('have.value', _.selectedWarranty.sku);
      });
    });
  });

  describe('add product without a selected warranty to cart', () => {
    it('add product without warranty to cart', () => {
      ProductDetailPage.navigateTo(_.product2.sku);
      // FamilyPage.navigateTo(_.category);
      // at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.productWithWarrantySKU2));
      at(ProductDetailPage, page => {
        page.warranties.should('exist');
        page.addProductToCart();
        page.header.miniCart.goToCart();
      });
    });

    it('product in cart should have a select-box with no selected warranty', () => {
      at(CartPage, page => {
        page.lineItems.should('have.length', 2);
        page.lineItem(_.product2.index).warranties.should('have.value', _.noWarrantyValue);
      });
    });

    const totalPrice = _.product1.price + _.product2.price + _.selectedWarranty.price * 2;

    it('changing the warranty should update the cart total', () => {
      at(CartPage, page => {
        page.selectWarranty(_.product2.index, _.selectedWarranty.sku);
        page.lineItem(_.product2.index).warranties.should('have.value', _.selectedWarranty.sku);
        page.subtotal.should('contain', totalPrice); // doesn't work
      });
    });
  });
});

// at(ProductDetailPage, page => page.sku.should('have.text', _.otherVariationSKU));
