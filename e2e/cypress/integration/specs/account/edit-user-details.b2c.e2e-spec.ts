import { at } from '../../framework';
import { createUserViaREST } from '../../framework/users';
import { LoginPage } from '../../pages/account/login.page';
import { ProfileEditDetailsPage, ProfileEditDetailsTypes } from '../../pages/account/profile-edit-details.page';
import { ProfilePage } from '../../pages/account/profile.page';
import { sensibleDefaults } from '../../pages/account/registration.page';

const _ = {
  user: { login: `testuser${new Date().getTime()}@test.intershop.de`, ...sensibleDefaults },
  newDetails: {
    title: 'Ms.',
    firstName: 'Maria',
    lastName: 'Mustermann',
    phoneHome: '99999999',
  } as ProfileEditDetailsTypes,
};

describe('Changing User', () => {
  before(() => {
    createUserViaREST(_.user);

    LoginPage.navigateTo('/account/profile');
    at(LoginPage, page =>
      page.fillForm(_.user.login, _.user.password).submit().its('response.statusCode').should('equal', 200)
    );

    at(ProfilePage, page => {
      page.name.should('have.text', `${_.user.firstName} ${_.user.lastName}`);
      page.phone.should('have.text', _.user.phoneHome);
    });
  });

  it('should be able to edit details and see changes', () => {
    at(ProfilePage, page => page.editDetails());

    at(ProfileEditDetailsPage, page =>
      page.fillForm(_.newDetails).submit().its('response.statusCode').should('equal', 200)
    );
    at(ProfilePage, page => {
      page.header.myAccountLink.should('have.text', `${_.newDetails.firstName} ${_.newDetails.lastName}`);
      page.name.should('have.text', `${_.newDetails.title} ${_.newDetails.firstName} ${_.newDetails.lastName}`);
      page.phone.should('have.text', _.newDetails.phoneHome);
    });
  });
});
