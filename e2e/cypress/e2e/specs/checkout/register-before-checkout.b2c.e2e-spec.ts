import { at } from '../../framework';
import { Registration, RegistrationPage, sensibleDefaults } from '../../pages/account/registration.page';
import { CartPage } from '../../pages/checkout/cart.page';
import { AddressDetailsTypes, CheckoutAddressesPage } from '../../pages/checkout/checkout-addresses.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  catalog: 'Home-Entertainment',
  category: {
    id: 'Home-Entertainment.SmartHome',
    name: 'Smart Home',
  },
  product: {
    sku: '201807171',
    price: 175.0,
  },
  address: {
    countryCode: 'DE',
    firstName: 'Pablo',
    lastName: 'Parkes',
    addressLine1: 'Marbacher Str. 87',
    city: 'Stuttgart',
    postalCode: '12345',
  } as AddressDetailsTypes,
  email: 'p.parkes@test.intershop.de',
  user: {
    login: `testuser${new Date().getTime()}@test.intershop.de`,
    ...sensibleDefaults,
  } as Registration,
};

describe('Anonymous Checkout with registration', () => {
  before(() => {
    ProductDetailPage.navigateTo(_.product.sku);
  });

  it('should add a product to cart', () => {
    at(ProductDetailPage, page => {
      page.addProductToCart().its('response.statusCode').should('equal', 201);
      page.header.miniCart.total.should('contain', _.product.price);
      page.header.miniCart.goToCart();
    });
    at(CartPage);
  });

  it('should start checkout by navigating to the registration page', () => {
    at(CartPage, page => page.beginCheckout());
    at(CheckoutAddressesPage, page => {
      page.registerBeforeCheckout();
    });
    at(RegistrationPage);
  });

  it('should continue checkout after registration', () => {
    at(RegistrationPage, page => {
      page.fillForm(_.user);
      page.acceptTAC();
      page.submitAndObserve().its('response.statusCode').should('equal', 201);
    });
    at(CheckoutAddressesPage, page => {
      page.invoiceToAddress.should('contain', _.user.lastName);
    });
  });
});
