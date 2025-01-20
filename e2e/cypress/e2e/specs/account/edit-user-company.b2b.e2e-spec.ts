import { at } from '../../framework';
import { createB2BUserViaREST } from '../../framework/b2b-user';
import { LoginPage } from '../../pages/account/login.page';
import {
  OrganizationSettingsEditCompanyPage,
  OrganizationSettingsEditCompanyTypes,
} from '../../pages/account/organization-settings-edit-company.page';
import { OrganizationSettingsPage } from '../../pages/account/organization-settings.page';
import { sensibleDefaults } from '../../pages/account/registration.page';

const _ = {
  user: { ...sensibleDefaults, login: `testuser${new Date().getTime()}@test.intershop.de`, companyName1: 'Big Foods' },
  newDetails: {
    companyName: 'REALLY',
    companyName2: 'Big Foods',
    taxationID: '987654321',
  } as OrganizationSettingsEditCompanyTypes,
};

describe('Changing User', () => {
  before(() => {
    createB2BUserViaREST(_.user);

    LoginPage.navigateTo('/account/organization/settings');
    at(LoginPage, page =>
      page.fillForm(_.user.login, _.user.password).submit().its('response.statusCode').should('equal', 200)
    );
    at(OrganizationSettingsPage, page => {
      page.companyName.should('contain', _.user.companyName1);
      page.taxationId.should('be.empty');
    });
  });

  it('should be able to edit company details and see changes', () => {
    at(OrganizationSettingsPage, page => page.editCompanyDetails());

    at(OrganizationSettingsEditCompanyPage, page =>
      page.fillForm(_.newDetails).submit().its('response.statusCode').should('equal', 200)
    );
    at(OrganizationSettingsPage, page => {
      page.companyName.should('contain', `${_.newDetails.companyName}${_.newDetails.companyName2}`);
      page.taxationId.should('contain', _.newDetails.taxationID);
    });
  });
});
