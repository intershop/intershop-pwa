import { at } from '../../framework';
import { createUserViaREST } from '../../framework/users';
import { LoginPage } from '../../pages/account/login.page';
import { MyAccountPage } from '../../pages/account/my-account.page';
import { Registration, sensibleDefaults } from '../../pages/account/registration.page';

const _ = {
  loginForm: {
    englishTitle: 'Sign in',
    germanTitle: 'Anmelden',
  },
  user: {
    ...sensibleDefaults,
    login: `testuser${new Date().getTime()}@test.intershop.de`,
    firstName: 'Peter',
    lastName: 'Parker',
  } as Registration,
};

describe('Language Changing User', () => {
  describe('when logged in', () => {
    before(() => {
      cy.clearCookie('preferredLocale');
      LoginPage.navigateTo();
    });

    it('should log in', () => {
      createUserViaREST(_.user);
      at(LoginPage, page =>
        page.fillForm(_.user.login, _.user.password).submit().its('response.statusCode').should('equal', 200)
      );
      at(MyAccountPage, page =>
        page.header.myAccountLink.should('have.text', `${_.user.firstName} ${_.user.lastName}`)
      );
    });

    it('when switching to german', () => {
      at(MyAccountPage, page => {
        page.header.switchLanguage('Deutsch');
      });
    });

    it('should still be logged in', () => {
      at(MyAccountPage, page =>
        page.header.myAccountLink.should('have.text', `${_.user.firstName} ${_.user.lastName}`)
      );
    });
  });

  describe('when accessing protected content without cookie', () => {
    before(() => {
      cy.clearCookie('apiToken');
      cy.clearCookie('preferredLocale');
      MyAccountPage.navigateTo();
    });

    it('should see english content on login page', () => {
      at(LoginPage, page => page.content.should('contain', _.loginForm.englishTitle));
    });

    it('when switching to german', () => {
      at(LoginPage, page => page.header.switchLanguage('Deutsch'));
    });

    it('should see german content on login page', () => {
      at(LoginPage, page => page.content.should('contain', _.loginForm.germanTitle));
    });
  });
});
