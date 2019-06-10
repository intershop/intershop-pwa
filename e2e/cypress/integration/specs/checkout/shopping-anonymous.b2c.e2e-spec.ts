import { at } from '../../framework';

import { AddressDetailsTypes, AddressesPage } from '../../pages/checkout/addresses.page';
import { CartPage } from '../../pages/checkout/cart.page';
import { PaymentPage } from '../../pages/checkout/payment.page';
import { ReceiptPage } from '../../pages/checkout/receipt.page';
import { ReviewPage } from '../../pages/checkout/review.page';
import { ShippingPage } from '../../pages/checkout/shipping.page';
import { HomePage } from '../../pages/home.page';
import { CategoryPage } from '../../pages/shopping/category.page';
import { FamilyPage } from '../../pages/shopping/family.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  catalog: 'Cameras-Camcorders',
  category: {
    id: 'Cameras-Camcorders.584',
    name: 'Camcorders',
  },
  product: {
    sku: '3953312',
    price: 303.62,
  },
  address: {
    countryCodeSwitch: 'DE',
    firstName: 'Pablo',
    lastName: 'Parkes',
    addressLine1: 'Marbacher Str. 87',
    city: 'Stuttgart',
    postalCode: '12345',
  } as AddressDetailsTypes,
  email: 'p.parkes@test.com',
};

describe('Anonymous Checkout', () => {
  before(() => HomePage.navigateTo());

  it('should navigate to a product', () => {
    at(HomePage, page => page.header.gotoCategoryPage(_.catalog));
    at(CategoryPage, page => page.gotoSubCategory(_.category.id));
    at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product.sku));
    at(ProductDetailPage, page => {
      page.sku.should('have.text', _.product.sku);
      page.price.should('contain', _.product.price);
    });
  });

  it('should add the product to cart', () => {
    at(ProductDetailPage, page => {
      page
        .addProductToCart()
        .its('status')
        .should('equal', 200);
      page.header.miniCart.total.should('contain', _.product.price);
      page.header.miniCart.goToCart();
    });
    at(CartPage);
  });

  it('should start guest checkout by filling out the address form', () => {
    at(CartPage, page => page.beginCheckout());
    at(AddressesPage, page => {
      page.guestCheckout();
      page.fillInvoiceAddressForm(_.address, _.email);
      page.continueCheckout();
    });
    at(ShippingPage);
  });

  it('should accept default shipping option', () => {
    at(ShippingPage, page => page.continueCheckout());
  });

  it('should select invoice payment', () => {
    at(PaymentPage, page => {
      page.selectPayment('INVOICE');
      page.continueCheckout();
    });
  });

  it('should review order and submit', () => {
    at(ReviewPage, page => {
      page.acceptTAC();
      page.submitOrder();
    });
  });

  it('should check the receipt and continue shopping', () => {
    at(ReceiptPage, page => {
      page.continueShopping();
    });
    at(HomePage);
  });
});
