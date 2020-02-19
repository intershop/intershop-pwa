import { at } from '../../framework';
import { createB2BUserViaREST } from '../../framework/b2b-user';
import { LoginPage } from '../../pages/account/login.page';
import { MyAccountPage } from '../../pages/account/my-account.page';
import { QuoteDetailPage } from '../../pages/account/quote-detail.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { CartPage } from '../../pages/checkout/cart.page';
import { CategoryPage } from '../../pages/shopping/category.page';
import { FamilyPage } from '../../pages/shopping/family.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';
import { QuoteRequestDialog } from '../../pages/shopping/quote-request.dialog';

const _ = {
  user: {
    login: `test${new Date().getTime()}@testcity.de`,
    ...sensibleDefaults,
  },
  catalog: 'networks',
  categoryId: 'networks.firewalls',
  product: {
    sku: '859910',
    price: 171.25,
  },
};

const quantity = 2;

describe('Quote Handling', () => {
  before(() => {
    createB2BUserViaREST(_.user);
    LoginPage.navigateTo();
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page
        .submit()
        .its('status')
        .should('equal', 200);
    });
  });

  it('user adds one product from product detail page to quote', () => {
    at(MyAccountPage, page => page.header.gotoCategoryPage(_.catalog));
    at(CategoryPage, page => page.gotoSubCategory(_.categoryId));
    at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product.sku));
    at(ProductDetailPage, page => {
      page.setQuantity(quantity);
      page.addProductToQuoteRequest();
    });
    at(QuoteRequestDialog, dialog => {
      dialog.gotoQuoteDetail();
    });
    at(QuoteDetailPage, page => {
      page.totalPrice.should('contain', _.product.price * quantity);
      page.deleteItemFromQuoteRequest();
    });
  });

  it('user adds one product from product list page to quote', () => {
    at(MyAccountPage, page => page.header.gotoCategoryPage(_.catalog));
    at(CategoryPage, page => page.gotoSubCategory(_.categoryId));
    at(FamilyPage, page => page.productList.addProductToQuoteRequest(_.product.sku));
    at(QuoteRequestDialog, dialog => {
      dialog.gotoQuoteDetail();
    });
    at(QuoteDetailPage, page => {
      page.totalPrice.should('contain', _.product.price);
      page.deleteItemFromQuoteRequest();
    });
  });

  it('user adds one product from basket to quote', () => {
    at(MyAccountPage, page => page.header.gotoCategoryPage(_.catalog));
    at(CategoryPage, page => page.gotoSubCategory(_.categoryId));
    at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product.sku));
    at(ProductDetailPage, page => {
      page.setQuantity(quantity);
      page
        .addProductToCart()
        .its('status')
        .should('equal', 201);
      page.header.miniCart.goToCart();
    });
    at(CartPage, page => {
      page.createQuoteRequest();
    });
    at(QuoteDetailPage, page => {
      page.totalPrice.should('contain', _.product.price * quantity);
      page.deleteItemFromQuoteRequest();
    });
  });

  it('user adds one product from product list page to quote and submit it', () => {
    at(MyAccountPage, page => page.header.gotoCategoryPage(_.catalog));
    at(CategoryPage, page => page.gotoSubCategory(_.categoryId));
    at(FamilyPage, page => page.productList.addProductToQuoteRequest(_.product.sku));
    at(QuoteRequestDialog, dialog => {
      dialog.submitQuoteRequest();
    });
    at(QuoteDetailPage, page => {
      page.quoteState.should('have.text', 'Submitted');
    });
  });

  it('user copy quote from account quote request detail page and logs out', () => {
    at(MyAccountPage, page => page.header.gotoCategoryPage(_.catalog));
    at(CategoryPage, page => page.gotoSubCategory(_.categoryId));
    at(FamilyPage, page => page.productList.addProductToQuoteRequest(_.product.sku));
    at(QuoteRequestDialog, dialog => {
      dialog.submitQuoteRequest();
    });
    at(QuoteDetailPage, page => {
      page.copyQuoteRequest();
      page.header.logout();
    });
  });
});
