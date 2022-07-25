import { at } from '../../framework';
import { createB2BUserViaREST } from '../../framework/b2b-user';
import { LoginPage } from '../../pages/account/login.page';
import { MyAccountPage } from '../../pages/account/my-account.page';
import { QuoteDetailPage } from '../../pages/account/quote-detail.page';
import { QuoteListPage } from '../../pages/account/quote-list.page';
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

describe('Quote Handling', () => {
  before(() => {
    createB2BUserViaREST(_.user);
    LoginPage.navigateTo();
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page.submit().its('response.statusCode').should('equal', 200);
    });
  });

  it('should check number of quotes', () => {
    at(MyAccountPage, page => {
      page.submittedQuotesCount.should('have.text', ' 0 ');
      page.respondedQuotesCount.should('have.text', ' 0 ');
    });
  });

  it('user adds one product from product detail page to quote', () => {
    const quantity = 2;
    at(MyAccountPage, page => page.header.gotoCategoryPage(_.catalog));
    at(CategoryPage, page => page.gotoSubCategory(_.categoryId));
    at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product.sku));
    at(ProductDetailPage, page => {
      page.setQuantity(quantity);
      page.addProductToQuoteRequest();
    });
    at(QuoteRequestDialog, dialog => {
      dialog.totalPrice.should('contain', _.product.price * quantity);
      dialog.hide();
      dialog.assertClosed();
    });
  });

  it('user adds one product from product list page to quote', () => {
    at(ProductDetailPage, page => page.breadcrumb.items.eq(2).click());
    at(FamilyPage, page => page.productList.addProductToQuoteRequest(_.product.sku));
    at(QuoteRequestDialog, dialog => {
      dialog.totalPrice.should('contain', _.product.price * 3);
      dialog.hide();
      dialog.assertClosed();
    });
  });

  it('user adds one product from basket to quote', () => {
    const quantity = 2;
    at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product.sku));
    at(ProductDetailPage, page => {
      page.setQuantity(quantity);
      page.addProductToCart().its('response.statusCode').should('equal', 201);
      page.header.miniCart.goToCart();
    });
    at(CartPage, page => {
      page.createQuoteRequest();
    });
    at(QuoteDetailPage, page => {
      page.totalPrice.should('contain', _.product.price * quantity);
    });
  });

  it('user deletes item and quote', () => {
    at(QuoteDetailPage, page => {
      page.deleteItemFromQuoteRequest();
      page.breadcrumb.items.eq(2).click();
    });
    at(QuoteListPage, page => {
      page.deleteQuote(0);
    });
  });

  it('user adds one product from product list page to quote and submit it', () => {
    at(MyAccountPage, page => page.header.gotoCategoryPage(_.catalog));
    at(CategoryPage, page => page.gotoSubCategory(_.categoryId));
    at(FamilyPage, page => page.productList.addProductToQuoteRequest(_.product.sku));
    at(QuoteRequestDialog, dialog => {
      dialog.submitQuoteRequest().then(quoteId => {
        dialog.hide();
        at(FamilyPage, page => page.header.goToMyAccount());
        at(MyAccountPage, page => page.navigateToQuoting());
        at(QuoteListPage, page => {
          page.breadcrumb.items.should('have.length', 3);
          page.goToQuoteDetailLink(quoteId);
        });
      });
    });
    at(QuoteDetailPage, page => {
      page.breadcrumb.items.should('have.length', 4);
      page.quoteState.should('have.text', 'Submitted');
    });
  });

  it('user copies quote request', () => {
    at(QuoteDetailPage, page => {
      page.copyQuoteRequest();
      page.quoteState.should('have.text', 'New');
      page.totalPrice.should('contain', _.product.price * 4);
    });
  });

  it('user adds product to quote request from family page', () => {
    at(QuoteDetailPage, page => page.header.gotoCategoryPage(_.catalog));
    at(CategoryPage, page => page.gotoSubCategory(_.categoryId));
    at(FamilyPage, page => page.productList.addProductToQuoteRequest(_.product.sku));
    at(QuoteRequestDialog, dialog => {
      dialog.hide();
    });
  });

  it('should check number of quotes again', () => {
    at(FamilyPage, page => page.header.goToMyAccount());
    at(MyAccountPage, page => {
      page.submittedQuotesCount.should('have.text', ' 1 ');
    });
  });
});
