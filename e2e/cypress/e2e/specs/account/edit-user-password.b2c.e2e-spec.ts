import { at } from '../../framework';
import { createUserViaREST } from '../../framework/users';
import { LoginPage } from '../../pages/account/login.page';
import { ProfileEditPasswordPage } from '../../pages/account/profile-edit-password.page';
import { ProfilePage } from '../../pages/account/profile.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { HomePage } from '../../pages/home.page';

const _ = {
  user: { login: `testuser${new Date().getTime()}@test.intershop.de`, ...sensibleDefaults },
  newPassword: `admin123DE`,
};

describe('Changing User', () => {
  before(() => {
    createUserViaREST(_.user);

    LoginPage.navigateTo('/account/profile');
    at(LoginPage, page =>
      page.fillForm(_.user.login, _.user.password).submit().its('response.statusCode').should('equal', 200)
    );
  });

  it('should be able to edit password', () => {
    at(ProfilePage, page => page.editPassword());

    at(ProfileEditPasswordPage, page =>
      page
        .fillForm({ password: _.newPassword, currentPassword: _.user.password })
        .submit()
        .its('response.statusCode')
        .should('equal', 204)
    );
    at(ProfilePage, page => page.header.logout());
  });

  it('should use new password for logging in', () => {
    at(HomePage, page => page.header.gotoLoginPage());
    at(LoginPage, page =>
      page.fillForm(_.user.login, _.newPassword).submit().its('response.statusCode').should('equal', 200)
    );
  });
});
