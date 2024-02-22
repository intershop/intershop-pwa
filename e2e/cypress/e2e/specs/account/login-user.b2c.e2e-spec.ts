import { at } from '../../framework';
import { createUserViaREST } from '../../framework/users';
import { LoginPage } from '../../pages/account/login.page';
import { MyAccountPage } from '../../pages/account/my-account.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { HomePage } from '../../pages/home.page';

const _ = {
  user: { ...sensibleDefaults, login: `testuser${new Date().getTime()}@test.intershop.de` },
  password: '!InterShop00!',
  wrongPassword: 'wrong',
};

describe('Returning User', () => {
  describe('with valid password', () => {
    before(() => {
      createUserViaREST(_.user);

      HomePage.navigateTo();
    });

    it('should press login and be routed to login page', () => {
      at(HomePage, page => {
        page.header.gotoLoginPage();
      });
      at(LoginPage);
    });

    it('should enter credentials and submit and be directed to my-account', () => {
      at(LoginPage, page => {
        page.errorText.should('not.exist');
        page.fillForm(_.user.login, _.password);
        page.submit().its('response.statusCode').should('equal', 200);
      });
      at(MyAccountPage, page => {
        page.header.myAccountLink.should('have.text', `${_.user.firstName} ${_.user.lastName}`);
      });
    });

    it('should have saved apiToken as cookie and within localStorage', () => {
      cy.getCookie('apiToken').then(cookie => {
        expect(cookie).to.not.be.empty;
        cy.wrap(JSON.parse(decodeURIComponent(cookie.value))).should('have.property', 'type', 'user');
      });

      cy.getAllLocalStorage().then(
        localStorage => expect(localStorage[Cypress.config('baseUrl')].access_token).to.not.be.empty
      );
    });

    it('should logout and be redirected to home page', () => {
      at(MyAccountPage, page => {
        page.header.logout();
      });
      at(HomePage);
    });

    it('should have removed apiToken cookie and infos from localStorage', () => {
      cy.getCookie('apiToken').then(cookie => {
        expect(cookie).to.be.null;
      });

      cy.getAllLocalStorage().then(
        localStorage => expect(localStorage[Cypress.config('baseUrl')].access_token).to.be.undefined
      );
    });
  });

  describe('with wrong password', () => {
    before(() => LoginPage.navigateTo());

    it('should enter wrong credentials and submit and be be still at login page', () => {
      at(LoginPage, page => {
        page.fillForm(_.user.login, _.wrongPassword);
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
