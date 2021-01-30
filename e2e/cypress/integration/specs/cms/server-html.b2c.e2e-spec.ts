import { at, waitLoadingEnd } from '../../framework';
import { LoginPage } from '../../pages/account/login.page';
import { HomePage } from '../../pages/home.page';
import { CategoryPage } from '../../pages/shopping/category.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  productSku: '8182790134362',
  categoryId: 'Computers',
  pageId: 'page.aboutus',
  route: 'register',
};

describe('Server Html', () => {
  beforeEach(() => {
    LoginPage.navigateTo();

    cy.intercept('GET', '**/cms/**', {
      statusCode: 200,
      body: {
        definitionQualifiedName: 'app_sf_pwa_cm:include.homepage.content.pagelet2-Include',
        displayName: 'Homepage Content',
        id: 'include.homepage.content.pagelet2-Include',
        link: {
          title: 'include.homepage.content.pagelet2-Include',
          type: 'Link',
          uri: 'inSPIRED-inTRONICS-Site/-/cms/includes/include.homepage.content.pagelet2-Include',
        },
        pagelets: [
          {
            definitionQualifiedName: 'app_sf_base_cm:component.common.freeStyle.pagelet2-Component',
            link: {
              type: 'Link',
              uri: 'inSPIRED-inTRONICS-Site/-/cms/pagelets/test_foo_bar',
              title: 'test_foo_bar',
            },
            displayName: 'test',
            id: 'test_foo_bar',
            configurationParameters: {
              HTML: {
                value: `
                  <div><a href="product://${_.productSku}@inSPIRED-inTRONICS">product</a></div>
                  <div><a href="category://${_.categoryId}@inSPIRED-Computers">category</a></div>
                  <div><a href="page://${_.pageId}">page</a></div>
                  <div><a href="route://${_.route}">route</a></div>
                  <img src="https://./?[ismediaobject]isfile://inSPIRED-Site/inTRONICS-b2c-responsive/inSPIRED-inTRONICS-b2c-responsive/en_US/logo%402x.png|/INTERSHOP/static/WFS/inSPIRED-Site/inTRONICS-b2c-responsive/inSPIRED-inTRONICS-b2c-responsive/en_US/logo%402x.png[/ismediaobject]" alt="" width="92" height="92" style="width: unset;" />`,
                definitionQualifiedName: 'app_sf_base_cm:component.common.freeStyle.pagelet2-Component-HTML',
              },
            },
          },
        ],
      },
    });

    at(LoginPage, page => page.header.gotoHomePage());
  });

  it('user should be able to follow product link', () => {
    at(HomePage, () => {
      cy.get('a').contains('product').click();

      waitLoadingEnd();

      at(ProductDetailPage, page => page.sku.should('have.text', _.productSku));
    });
  });

  it('user should be able to follow category link', () => {
    at(HomePage, () => {
      cy.get('a').contains('category').click();

      waitLoadingEnd();

      at(CategoryPage, page => page.categoryId.should('equal', _.categoryId));
    });
  });

  it('user should be able to follow page link', () => {
    at(HomePage, () => {
      cy.get('a').contains('page').click();

      waitLoadingEnd();

      cy.location()
        .its('pathname')
        .should('equal', '/page/' + _.pageId);
    });
  });

  it('user should be able to follow route link', () => {
    at(HomePage, () => {
      cy.get('a').contains('route').click();

      waitLoadingEnd();

      cy.location()
        .its('pathname')
        .should('equal', '/' + _.route);
    });
  });
});
