import { at } from '../../framework';
import { createB2BUserViaREST } from '../../framework/b2b-user';
import { LoginPage } from '../../pages/account/login.page';
import { ProfileEditCompanyPage, ProfileEditCompanyTypes } from '../../pages/account/profile-edit-company.page';
import { ProfilePage } from '../../pages/account/profile.page';
import { sensibleDefaults } from '../../pages/account/registration.page';

const _ = {
  user: { login: `testuser${new Date().getTime()}@test.intershop.de`, companyName1: 'Big Foods', ...sensibleDefaults },
  newDetails: {
    companyName: 'REALLY',
    companyName2: 'Big Foods',
    taxationID: '987654321',
  } as ProfileEditCompanyTypes,
};

describe('Changing User', () => {
  before(() => {
    createB2BUserViaREST(_.user);

    LoginPage.navigateTo('/account/profile');
    at(LoginPage, page =>
      page.fillForm(_.user.login, _.user.password).submit().its('response.statusCode').should('equal', 200)
    );
    at(ProfilePage, page => {
      page.name.should('have.text', `${_.user.firstName} ${_.user.lastName}`);
      page.phone.should('have.text', _.user.phoneHome);
      page.companyName.should('have.text', _.user.companyName1);
      page.taxationId.should('be.empty');
    });
  });

  it('should be able to edit company details and see changes', () => {
    at(ProfilePage, page => page.editCompanyDetails());

    at(ProfileEditCompanyPage, page =>
      page.fillForm(_.newDetails).submit().its('response.statusCode').should('equal', 200)
    );
    at(ProfilePage, page => {
      page.companyName.should('have.text', `${_.newDetails.companyName}${_.newDetails.companyName2}`);
      page.taxationId.should('have.text', _.newDetails.taxationID);
    });
  });
});
