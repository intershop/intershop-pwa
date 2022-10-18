import { at } from '../../framework';
import { createUserViaREST } from '../../framework/users';
import { LoginPage } from '../../pages/account/login.page';
import { MyAccountPage } from '../../pages/account/my-account.page';
import { Registration, sensibleDefaults } from '../../pages/account/registration.page';
import { HomePage } from '../../pages/home.page';

const _ = {
  user: {
    ...sensibleDefaults,
    login: `testuser${new Date().getTime()}@test.intershop.de`,
    firstName: 'Peter',
    lastName: 'Parker',
  } as Registration,
};

describe('Returning User', () => {
  describe('when logged in', () => {
    before(() => LoginPage.navigateTo());

    it('should log in', () => {
      createUserViaREST(_.user);
      at(LoginPage, page =>
        page.fillForm(_.user.login, _.user.password).submit().its('response.statusCode').should('equal', 200)
      );
      at(MyAccountPage, page =>
        page.header.myAccountLink.should('have.text', `${_.user.firstName} ${_.user.lastName}`)
      );
      cy.getCookie('apiToken')
        .should('not.be.empty')
        .should(cookie => {
          cy.wrap(JSON.parse(decodeURIComponent(cookie.value))).should('have.property', 'type', 'user');
        });
    });

    it('should stay logged in when refreshing page once', () => {
      MyAccountPage.navigateTo();
      at(MyAccountPage);
      cy.getCookie('apiToken')
        .should('not.be.empty')
        .should(cookie => {
          cy.wrap(JSON.parse(decodeURIComponent(cookie.value))).should('have.property', 'type', 'user');
        });
    });

    it('should stay logged in when refreshing page twice', () => {
      MyAccountPage.navigateTo();
      at(MyAccountPage);
      cy.getCookie('apiToken')
        .should('not.be.empty')
        .should(cookie => {
          cy.wrap(JSON.parse(decodeURIComponent(cookie.value))).should('have.property', 'type', 'user');
        });
    });

    it('should stay logged in when refreshing page thrice', () => {
      MyAccountPage.navigateTo();
      at(MyAccountPage);
      cy.getCookie('apiToken')
        .should('not.be.empty')
        .should(cookie => {
          cy.wrap(JSON.parse(decodeURIComponent(cookie.value))).should('have.property', 'type', 'user');
        });
    });

    it('should log out and get the anonymous token', () => {
      at(MyAccountPage, page => page.header.logout());
      at(HomePage);
      // eslint-disable-next-line unicorn/no-null
      cy.getCookie('apiToken')
        .should('not.be.empty')
        .should(cookie => {
          cy.wrap(JSON.parse(decodeURIComponent(cookie.value))).should('have.property', 'type', 'anonymous');
        });
    });
  });

  describe('after a long time away', () => {
    before(() => cy.setCookie('apiToken', 'SOMETHING_INVALID'));

    it('should have to log in again', () => {
      MyAccountPage.navigateTo();
      at(LoginPage);
    });
  });
});
