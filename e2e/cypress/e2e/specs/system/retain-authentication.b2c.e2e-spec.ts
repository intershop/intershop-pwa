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

function checkApiTokenCookie(type: string) {
  cy.getCookie('apiToken').then(cookie => {
    expect(cookie).to.not.be.empty;
    cy.wrap(JSON.parse(decodeURIComponent(cookie.value))).should('have.property', 'type', type);
  });
}

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
      checkApiTokenCookie('user');
    });

    it('should stay logged in when refreshing page once', () => {
      MyAccountPage.navigateTo();
      at(MyAccountPage);
      checkApiTokenCookie('user');
    });

    it('should stay logged in when refreshing page twice', () => {
      MyAccountPage.navigateTo();
      at(MyAccountPage);
      checkApiTokenCookie('user');
    });

    it('should stay logged in when refreshing page thrice', () => {
      MyAccountPage.navigateTo();
      at(MyAccountPage);
      checkApiTokenCookie('user');
    });

    it('should log out and remove its apiToken cookie', () => {
      at(MyAccountPage, page => page.header.logout());
      at(HomePage);

      cy.getCookie('apiToken').then(cookie => {
        expect(cookie).to.be.null;
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
