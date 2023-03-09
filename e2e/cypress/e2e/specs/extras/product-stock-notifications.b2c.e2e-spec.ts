import { at, waitLoadingEnd } from '../../framework';
import { createUserViaREST } from '../../framework/users';
import { LoginPage } from '../../pages/account/login.page';
import { MyAccountPage } from '../../pages/account/my-account.page';
import { ProductNotificationsOverviewPage } from '../../pages/account/product-notifications-overview.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { CategoryPage } from '../../pages/shopping/category.page';
import { FamilyPage } from '../../pages/shopping/family.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

describe('Product Stock Notification MyAccount Functionality', () => {
  const _ = {
    user: {
      login: `test${new Date().getTime()}@testcity.de`,
      ...sensibleDefaults,
    },
    category: 'Computers',
    subcategory1: 'Computers.1835',
    subcategory2: 'Computers.1835.3003',
    product1: {
      sku: '3718340',
      name: 'Belkin F8N255eaBLK',
    },
    product2: {
      sku: '476196',
      name: 'Targus Platinum Plus',
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

  it('user creates two product stock notification', () => {
    at(ProductNotificationsOverviewPage, page => {
      page.header.gotoCategoryPage(_.category);
    });

    at(CategoryPage, page => page.gotoSubCategory(_.subcategory1));
    at(CategoryPage, page => page.gotoSubCategory(_.subcategory2));
    at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product1.sku));
    at(ProductDetailPage, page => {
      page.editProductNotification();
      page.editProductNotificationModule.editStockNotification(_.email1);
      page.header.goToMyAccount();
    });

    at(MyAccountPage, page => {
      page.navigateToProductNotifications();
      page.navigateToProductStockNotifications();
    });

    at(ProductNotificationsOverviewPage, page => {
      page.breadcrumb.items.should('have.length', 3);
      page.productNotificationNameArray.should('contain', _.product1.name);
      page.productNotificationMessage.should('contain', _.email1);
      page.productNotificationMessage.should('contain', 'back in stock');
    });

    at(ProductNotificationsOverviewPage, page => {
      page.header.gotoCategoryPage(_.category);
    });

    at(CategoryPage, page => page.gotoSubCategory(_.subcategory1));
    at(CategoryPage, page => page.gotoSubCategory(_.subcategory2));
    at(FamilyPage, page => page.productList.gotoProductDetailPageBySku(_.product2.sku));
    at(ProductDetailPage, page => {
      page.editProductNotification();
      page.editProductNotificationModule.editStockNotification(_.email1);
      page.header.goToMyAccount();
    });

    at(MyAccountPage, page => {
      page.navigateToProductNotifications();
      page.navigateToProductStockNotifications();
    });

    at(ProductNotificationsOverviewPage, page => {
      page.productNotificationNameArray.should('contain', _.product2.name);
      page.productNotificationListItemLinks.should('have.length', 2);
    });
  });

  it('user updates a product stock notification', () => {
    at(ProductNotificationsOverviewPage, page => {
      page.updateProductStockNotificationByProductName(_.product1.name, _.email2);

      page.productNotificationMessage.should('contain', _.email2);
    });
  });

  it('user deletes one product stock notification', () => {
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
