import { at, waitLoadingEnd } from '../../framework';
import { createB2BUserViaREST } from '../../framework/b2b-user';
import { LoginPage } from '../../pages/account/login.page';
import { MyAccountPage } from '../../pages/account/my-account.page';
import { OrderTemplatesDetailsPage } from '../../pages/account/order-templates-details.page';
import { OrderTemplatesOverviewPage } from '../../pages/account/order-templates-overview.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { CartPage } from '../../pages/checkout/cart.page';
import { CategoryPage } from '../../pages/shopping/category.page';
import { FamilyPage } from '../../pages/shopping/family.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  user: {
    login: `test${new Date().getTime()}@testcity.de`,
    ...sensibleDefaults,
  },
  category: 'networks',
  subcategory: 'networks.firewalls',
  product1: '859910',
  product2: '3459777',
  product3: '3542794',
};

describe('Order Template Shopping Experience Functionality', () => {
  const accountOrderTemplate = 'account order template';
  const basketOrderTemplate1 = 'basket order template1';
  const basketOrderTemplate2 = 'basket order template2';
  before(() => {
    createB2BUserViaREST(_.user);
    LoginPage.navigateTo('/account/order-templates');
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page.submit().its('response.statusCode').should('equal', 200);
      waitLoadingEnd();
    });
    at(OrderTemplatesOverviewPage, page => {
      page.addOrderTemplate(accountOrderTemplate);
      page.addOrderTemplate(basketOrderTemplate1);
    });
  });

  it('user adds a product from the product tile to order template', () => {
    at(OrderTemplatesOverviewPage, page => {
      page.header.gotoCategoryPage(_.category);
    });

    at(CategoryPage, page => page.gotoSubCategory(_.subcategory));
    at(FamilyPage, page =>
      page.productList.addToOrderTemplate.addProductToOrderTemplateFromList(_.product1, accountOrderTemplate)
    );
    at(OrderTemplatesDetailsPage, page => page.listItemLink.invoke('attr', 'href').should('contain', _.product1));
  });

  it('user adds a product from the product detail to order template', () => {
    at(OrderTemplatesDetailsPage, page => {
      page.header.gotoCategoryPage(_.category);
    });

    at(CategoryPage, page => page.gotoSubCategory(_.subcategory));
    at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product2));

    at(ProductDetailPage, page => {
      page.addProductToOrderTemplate();
      page.addToOrderTemplate.addProductToOrderTemplateFromPage(accountOrderTemplate, true);
    });
    at(OrderTemplatesDetailsPage, page => page.getOrderTemplateItemById(_.product2).should('exist'));
  });

  it('user adds an order template from order template detail page to cart', () => {
    at(OrderTemplatesDetailsPage, page => {
      page.addOrderTemplateToBasket(_.product1, 4);
      waitLoadingEnd();
      page.header.miniCart.goToCart();
    });
    at(CartPage, page => {
      page.lineItems.contains(_.product1).should('exist');
      page.lineItems.contains(_.product2).should('exist');
      page.lineItems
        .contains(_.product1)
        .closest('[data-testing-id="product-list-item"]')
        .find('[data-testing-id="quantity"]')
        .should('have.value', '4');

      page.lineItems
        .contains(_.product2)
        .closest('[data-testing-id="product-list-item"]')
        .find('[data-testing-id="quantity"]')
        .should('have.value', '1');
    });
  });

  it('user adds a cart product to order template from shopping cart', () => {
    at(CartPage, page => {
      page.addProductToOrderTemplate();
      page.addToOrderTemplate.addProductToOrderTemplateFromPage(basketOrderTemplate1, true);
    });
    at(OrderTemplatesDetailsPage, page => {
      page.listItemLink.invoke('attr', 'href').should('contain', _.product1);
      OrderTemplatesDetailsPage.navigateToOverviewPage();
    });
  });

  it('user adds an order template to the cart from order templates overview page', () => {
    at(OrderTemplatesOverviewPage, page => {
      page.header.gotoCategoryPage(_.category);
    });
    at(CategoryPage, page => page.gotoSubCategory(_.subcategory));
    at(FamilyPage, page =>
      page.productList.addToOrderTemplate.addProductToOrderTemplateFromList(_.product3, accountOrderTemplate)
    );
    at(OrderTemplatesDetailsPage, page => {
      page.getOrderTemplateItemById(_.product3).should('exist');
      OrderTemplatesDetailsPage.navigateToOverviewPage();
    });
    at(OrderTemplatesOverviewPage, page => {
      page.addOrderTemplateToCart(accountOrderTemplate);
      waitLoadingEnd(2000);
      page.header.miniCart.text.should('contain', '11 items');
      page.header.miniCart.goToCart();
    });
    at(CartPage, page => {
      page.lineItems.contains(_.product1).should('exist');
      page.lineItems
        .contains(_.product3)
        .closest('[data-testing-id="product-list-item"]')
        .find('[data-testing-id="quantity"]')
        .should('have.value', '1');
    });
  });
  it('user adds only the selected product in order template details', () => {
    at(CartPage, page => {
      page.lineItem(0).remove();
      waitLoadingEnd();
      page.addProductToOrderTemplate();
      page.addToOrderTemplate.addProductToOrderTemplateFromPage(accountOrderTemplate, true);
    });
    at(OrderTemplatesDetailsPage, page => {
      page.toggleCheckbox(_.product1);
      page.addOrderTemplateToBasket();
      page.header.miniCart.text.should('contain', '7 items');
      page.header.miniCart.goToCart();
    });
    at(CartPage, page => {
      page.lineItems.contains(_.product1).should('not.exist');
    });
  });

  it('user creates new order template from basket', () => {
    at(CartPage, page => {
      page.addProductToOrderTemplate();
      page.addToOrderTemplate.addProductToOrderTemplateFromPage(accountOrderTemplate, true);
    });
    OrderTemplatesDetailsPage.navigateToOverviewPage();
    at(OrderTemplatesOverviewPage, page => {
      page.addOrderTemplateToCart(accountOrderTemplate);
    });
    at(CartPage, page => {
      page.addBasketToOrderTemplate();
      page.addToOrderTemplate.addNewOrderTemplate(basketOrderTemplate2);
      page.header.goToMyAccount();
    });

    at(MyAccountPage, page => {
      page.navigateToOrderTemplates();
    });

    at(OrderTemplatesOverviewPage, page => {
      page.orderTemplatesTitlesArray.should('contain', basketOrderTemplate2);
    });
  });
});
