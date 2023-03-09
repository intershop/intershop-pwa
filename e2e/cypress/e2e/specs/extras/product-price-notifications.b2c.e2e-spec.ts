import { at, waitLoadingEnd } from '../../framework';
import { createUserViaREST } from '../../framework/users';
import { LoginPage } from '../../pages/account/login.page';
import { MyAccountPage } from '../../pages/account/my-account.page';
import { ProductNotificationsOverviewPage } from '../../pages/account/product-notifications-overview.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { CategoryPage } from '../../pages/shopping/category.page';
import { FamilyPage } from '../../pages/shopping/family.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

describe('Product Price Notification MyAccount Functionality', () => {
  const _ = {
    user: {
      login: `test${new Date().getTime()}@testcity.de`,
      ...sensibleDefaults,
    },
    category: 'Home-Entertainment',
    subcategory: 'Home-Entertainment.SmartHome',
    product1: {
      sku: '201807171',
      name: 'Google Home',
    },
    product2: {
      sku: '201807191',
      name: 'Philips Hue bridge',
    },
    email1: 'patricia@test.intershop.de',
    email2: 'test@test.intershop.de',
  };

  before(() => {
    createUserViaREST(_.user);
    LoginPage.navigateTo('/account/notifications');
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page.submit().its('response.statusCode').should('equal', 200);
      waitLoadingEnd();
    });
    at(ProductNotificationsOverviewPage);
  });

  it('user creates two product price notifications', () => {
    at(ProductNotificationsOverviewPage, page => {
      page.header.gotoCategoryPage(_.category);
    });

    at(CategoryPage, page => page.gotoSubCategory(_.subcategory));
    at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product1.sku));
    at(ProductDetailPage, page => {
      page.editProductNotification();
      page.editProductNotificationModule.editPriceNotification(150, _.email1);
      page.header.goToMyAccount();
    });

    at(MyAccountPage, page => {
      page.navigateToProductNotifications();
    });

    at(ProductNotificationsOverviewPage, page => {
      page.breadcrumb.items.should('have.length', 3);
      page.productNotificationNameArray.should('contain', _.product1.name);
      page.productNotificationMessage.should('contain', '150');
      page.productNotificationMessage.should('contain', _.email1);
      page.productNotificationMessage.should('contain', 'price reaches');
    });

    at(ProductNotificationsOverviewPage, page => {
      page.header.gotoCategoryPage(_.category);
    });

    at(CategoryPage, page => page.gotoSubCategory(_.subcategory));
    at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product2.sku));
    at(ProductDetailPage, page => {
      page.editProductNotification();
      page.editProductNotificationModule.editPriceNotification(50, _.email1);
      page.header.goToMyAccount();
    });

    at(MyAccountPage, page => {
      page.navigateToProductNotifications();
    });

    at(ProductNotificationsOverviewPage, page => {
      page.productNotificationMessage.should('contain', '50');
      page.productNotificationListItemLinks.should('have.length', 2);
    });
  });

  it('user updates a product price notification', () => {
    at(ProductNotificationsOverviewPage, page => {
      page.updateProductPriceNotificationByProductName(_.product1.name, 130, _.email2);

      page.productNotificationMessage.should('contain', '130');
      page.productNotificationMessage.should('contain', _.email2);
    });
  });

  it('user deletes one product price notification', () => {
    at(ProductNotificationsOverviewPage, page => {
      page.productNotificationsArray.then($listItems => {
        const initLen = $listItems.length;

        page.deleteProductNotificationByProductName(_.product1.name);

        page.productNotificationsArray.should('have.length', initLen - 1);
        page.productNotificationNameArray.should('not.contain', _.product1.sku);
      });
    });
  });
});
