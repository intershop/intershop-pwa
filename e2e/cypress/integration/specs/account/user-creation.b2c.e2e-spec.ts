import { at } from '../../framework';
import { createUserViaREST } from '../../framework/users';
import { LoginPage } from '../../pages/account/login.page';
import { MyAccountPage } from '../../pages/account/my-account.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { HomePage } from '../../pages/home.page';

const _ = {
  user: {
    login: `test${new Date().getTime()}@testcity.de`,
    ...sensibleDefaults,
  },
};

describe('Dynamically Created User', () => {
  before(() => LoginPage.navigateTo());

  it('should create a user via rest call', () => {
    createUserViaREST(_.user);
  });

  it('should log in as that user', () => {
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page.submit().its('response.statusCode').should('equal', 200);
    });
  });

  it('should log out again', () => {
    at(MyAccountPage, page => {
      page.header.logout();
    });
    at(HomePage);
  });
});
