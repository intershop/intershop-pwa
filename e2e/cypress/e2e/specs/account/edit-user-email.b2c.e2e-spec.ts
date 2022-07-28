import { at } from '../../framework';
import { createUserViaREST } from '../../framework/users';
import { LoginPage } from '../../pages/account/login.page';
import { ProfileEditEmailPage } from '../../pages/account/profile-edit-email.page';
import { ProfilePage } from '../../pages/account/profile.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { HomePage } from '../../pages/home.page';

const _ = {
  user: { login: `testuser${new Date().getTime()}@test.intershop.de`, ...sensibleDefaults },
  newEmail: `changed${new Date().getTime()}@test.intershop.de`,
};

describe('Changing User', () => {
  before(() => {
    createUserViaREST(_.user);

    LoginPage.navigateTo('/account/profile');
    at(LoginPage, page =>
      page.fillForm(_.user.login, _.user.password).submit().its('response.statusCode').should('equal', 200)
    );
  });

  it('should be able to edit email', () => {
    at(ProfilePage, page => {
      page.email.should('have.text', _.user.login);
      page.editEmail();
    });

    at(ProfileEditEmailPage, page =>
      page
        .fillForm({ email: _.newEmail, currentPassword: _.user.password })
        .submit()
        .its('response.statusCode')
        .should('equal', 200)
    );
    at(ProfilePage, page => {
      page.email.should('have.text', _.newEmail);
      page.header.logout();
    });
  });

  it('should be able to use new email for logging in', () => {
    at(HomePage, page => page.header.gotoLoginPage());
    at(LoginPage, page =>
      page.fillForm(_.newEmail, _.user.password).submit().its('response.statusCode').should('equal', 200)
    );
  });
});
