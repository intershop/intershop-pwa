import { at, waitLoadingEnd } from '../../framework';
import { createB2BUserViaREST } from '../../framework/b2b-user';
import { LoginPage } from '../../pages/account/login.page';
import { OrderTemplatesDetailsPage } from '../../pages/account/order-templates-details.page';
import { OrderTemplatesOverviewPage } from '../../pages/account/order-templates-overview.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
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

describe('Order Template MyAccount Functionality', () => {
  const orderTemplate = 'order template';
  const anotherOrderTemplate = 'another order template';

  before(() => {
    createB2BUserViaREST(_.user);
    LoginPage.navigateTo('/account/order-templates');
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page.submit().its('response.statusCode').should('equal', 200);
    });
    at(OrderTemplatesOverviewPage);
  });

  it('user creates an order template', () => {
    at(OrderTemplatesOverviewPage, page => {
      page.addOrderTemplate(orderTemplate);
      page.breadcrumb.items.should('have.length', 3);
      page.orderTemplatesArray.should('have.length', 1);
      page.orderTemplatesTitlesArray.should('contain', orderTemplate);
    });
  });

  it('user creates another order template', () => {
    at(OrderTemplatesOverviewPage, page => {
      page.addOrderTemplate(orderTemplate);
      page.orderTemplatesArray.should('have.length', 2);
      page.orderTemplatesTitlesArray.should('contain', orderTemplate);
    });
  });

  it('user deletes first order template', () => {
    at(OrderTemplatesOverviewPage, page => {
      page.orderTemplatesArray.then($listItems => {
        const initLen = $listItems.length;
        const firstItem = $listItems.first();

        page.deleteOrderTemplateById('order template');
        page.orderTemplatesArray.should('have.length', initLen - 1);
        page.orderTemplatesArray.should('not.include', firstItem);
      });
    });
  });

  it('user adds 2 products from the product detail page to order template', () => {
    at(OrderTemplatesOverviewPage, page => {
      page.addOrderTemplate(anotherOrderTemplate);
      page.header.gotoCategoryPage(_.category);
    });

    at(CategoryPage, page => page.gotoSubCategory(_.subcategory));
    at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product2));
    at(ProductDetailPage, page => {
      page.addProductToOrderTemplate();
      page.addToOrderTemplate.addProductToOrderTemplateFromPage(orderTemplate, true);
    });
    at(OrderTemplatesDetailsPage, page => {
      page.breadcrumb.items.should('have.length', 4);
      page.breadcrumb.items.eq(3).should('contain', orderTemplate);
      page.listItemLink.invoke('attr', 'href').should('contain', _.product2);
      page.header.gotoCategoryPage(_.category);
    });

    at(CategoryPage, page => page.gotoSubCategory(_.subcategory));
    at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product1));
    at(ProductDetailPage, page => {
      page.addProductToOrderTemplate();
      page.addToOrderTemplate.addProductToOrderTemplateFromPage(orderTemplate, true);
    });
    at(OrderTemplatesDetailsPage, page => {
      page.listItemLink.should('have.length', 2);
    });
  });

  it('user deletes a product from order template', () => {
    at(OrderTemplatesDetailsPage, page => {
      page.listItemLink.then($listItems => {
        const initLength = $listItems.length;
        page.deleteOrderTemplate(_.product2);
        waitLoadingEnd(1000);
        page.listItemLink.invoke('attr', 'href').should('not.contain', _.product2);
        page.listItemLink.should('have.length', initLength - 1);
      });
    });
  });

  it('user moves a product to another order template', () => {
    at(OrderTemplatesDetailsPage, page => {
      page.moveProductToOrderTemplate(_.product1, anotherOrderTemplate);
      waitLoadingEnd(1000);
      page.breadcrumb.items.eq(3).should('contain', anotherOrderTemplate);
      page.OrderTemplateTitle.should('contain', anotherOrderTemplate);
      page.getOrderTemplateItemById(_.product1).should('exist');
      OrderTemplatesDetailsPage.navigateToOverviewPage();
    });
    at(OrderTemplatesOverviewPage, page => {
      page.goToOrderTemplateDetailLink(orderTemplate);
    });

    at(OrderTemplatesDetailsPage, page => {
      page.listItem.should('not.exist');
    });
  });
});
