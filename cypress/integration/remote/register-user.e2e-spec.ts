import { at } from '../framework';
import { LoginPage } from '../pages/account/login.page';
import { MyAccountPage } from '../pages/account/my-account.page';
import { Registration, RegistrationPage, sensibleDefaults } from '../pages/account/registration.page';
import { HomePage } from '../pages/home.page';

const _ = {
  user: {
    login: `testuser${new Date().getTime()}@test.intershop.de`,
    ...sensibleDefaults,
  } as Registration,
};

describe('New User', () => {
  before(() => HomePage.navigateTo());

  it('should click register link and land at registration page', () => {
    at(HomePage, page => {
      page.header.gotoRegistrationPage();
    });
    at(RegistrationPage);
  });

  it('should fill in registration form an submit', () => {
    at(RegistrationPage, page => {
      page.fillForm(_.user);
      page
        .submit()
        .its('statusMessage')
        .should('equal', '201 (Created)');
    });
  });

  it('should be at my account page and logged in', () => {
    at(MyAccountPage, page => {
      page.header.myAccountLink.should('have.text', `${_.user.firstName} ${_.user.lastName}`);
    });
  });

  it('should log out and log in and log out again', () => {
    at(MyAccountPage, page => {
      page.header.logout();
    });
    at(HomePage, page => {
      page.header.gotoLoginPage();
    });
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page
        .submit()
        .its('status')
        .should('equal', 200);
    });
    at(MyAccountPage, page => {
      page.header.myAccountLink.should('have.text', `${_.user.firstName} ${_.user.lastName}`);
    });
    at(MyAccountPage, page => {
      page.header.logout();
    });
    at(HomePage);
  });
});
