import { at } from '../../framework';
import { LoginPage } from '../../pages/account/login.page';
import { MyAccountPage } from '../../pages/account/my-account.page';
import { HomePage } from '../../pages/home.page';

const _ = {
  name: 'Patricia Miller',
  email: 'patricia@test.intershop.de',
  password: '!InterShop00!',
  wrongPassword: 'wrong',
};

describe('Returning User', () => {
  describe('with valid password', () => {
    before(() => HomePage.navigateTo());

    it('should press login and be routed to login page', () => {
      at(HomePage, page => {
        page.header.gotoLoginPage();
      });
      at(LoginPage);
    });

    it('should enter credentials and submit and be directed to my-account', () => {
      at(LoginPage, page => {
        page.errorText.should('not.exist');
        page.fillForm(_.email, _.password);
        page.submit().its('response.statusCode').should('equal', 200);
      });
      at(MyAccountPage, page => {
        page.header.myAccountLink.should('have.text', _.name);
      });
    });

    it('should logout and be redirected to home page', () => {
      at(MyAccountPage, page => {
        page.header.logout();
      });
      at(HomePage);
    });
  });

  describe('with wrong password', () => {
    before(() => LoginPage.navigateTo());

    it('should enter wrong credentials and submit and be be still at login page', () => {
      at(LoginPage, page => {
        page.fillForm(_.email, _.wrongPassword);
        page.submit().its('response.statusCode').should('equal', 401);
        page.errorText.should('be.visible');
      });
    });
  });
});

describe('Anonymous User', () => {
  describe('navigating to protected url', () => {
    before(() => MyAccountPage.navigateTo());

    it('should be redirected to login page', () => {
      at(LoginPage);
    });
  });
});
