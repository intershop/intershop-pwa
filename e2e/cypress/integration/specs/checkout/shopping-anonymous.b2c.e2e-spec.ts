import { at } from '../../framework';
import { CartPage } from '../../pages/checkout/cart.page';
import { AddressDetailsTypes, CheckoutAddressesPage } from '../../pages/checkout/checkout-addresses.page';
import { CheckoutPaymentPage } from '../../pages/checkout/checkout-payment.page';
import { CheckoutReceiptPage } from '../../pages/checkout/checkout-receipt.page';
import { CheckoutReviewPage } from '../../pages/checkout/checkout-review.page';
import { CheckoutShippingPage } from '../../pages/checkout/checkout-shipping.page';
import { HomePage } from '../../pages/home.page';
import { CategoryPage } from '../../pages/shopping/category.page';
import { FamilyPage } from '../../pages/shopping/family.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  catalog: 'Home-Entertainment',
  category: {
    id: 'Home-Entertainment.SmartHome',
    name: 'Smart Home',
  },
  product: {
    sku: '201807171',
    price: 185.5,
  },
  address: {
    countryCode: 'DE',
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
      page.addProductToCart().its('response.statusCode').should('equal', 201);
      page.header.miniCart.total.should('contain', _.product.price);
      page.header.miniCart.goToCart();
    });
    at(CartPage);
  });

  it('should start guest checkout by filling out the address form', () => {
    at(CartPage, page => page.beginCheckout());
    at(CheckoutAddressesPage, page => {
      page.guestCheckout();
      page.fillInvoiceAddressForm(_.address, _.email);
      page.continueCheckout();
    });
    at(CheckoutShippingPage);
  });

  it('should accept default shipping option', () => {
    at(CheckoutShippingPage, page => page.continueCheckout());
  });

  it('should not display the save for later option on payment page', () => {
    at(CheckoutPaymentPage, page => {
      page.addPaymentInstrument('ISH_CREDITCARD');
      page.saveForLaterCheckbox.should('not.exist');
    });
  });
  it('should select invoice payment', () => {
    at(CheckoutPaymentPage, page => {
      page.selectPayment('INVOICE');
      page.continueCheckout();
    });
  });

  it('should review order and submit', () => {
    at(CheckoutReviewPage, page => {
      page.acceptTAC();
      page.submitOrder();
    });
  });

  it('should check the receipt and continue shopping', () => {
    at(CheckoutReceiptPage, page => {
      page.continueShopping();
    });
    at(HomePage);
  });
});
