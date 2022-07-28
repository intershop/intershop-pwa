import { at } from '../../framework';
import { createB2BUserViaREST } from '../../framework/b2b-user';
import { LoginPage } from '../../pages/account/login.page';
import { PunchoutCreatePage } from '../../pages/account/punchout-create.page';
import { PunchoutEditPage } from '../../pages/account/punchout-edit.page';
import { PunchoutOverviewPage } from '../../pages/account/punchout-overview.page';
import { sensibleDefaults } from '../../pages/account/registration.page';

const _ = {
  user: {
    login: `test${new Date().getTime()}@testcity.de`,
    ...sensibleDefaults,
  },
  punchoutUser: {
    login: `punchoutuser${new Date().getTime()}@test.intershop.de`,
    password: 'Intershop00!',
  },
  punchoutUser2: {
    login: `punchoutuser2${new Date().getTime()}@test.intershop.de`,
    password: 'Intershop00!',
  },
};

describe('Punchout MyAccount Functionality', () => {
  before(() => {
    createB2BUserViaREST(_.user);
  });

  it('should start punchout management by logging in', () => {
    LoginPage.navigateTo('/account/punchout');
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page.submit().its('response.statusCode').should('equal', 200);
    });
    at(PunchoutOverviewPage, page => {
      page.page.should('be.visible');
      page.emptyList.should('be.visible');
      page.headerNavigation.should('be.visible');
    });
  });

  it('admin user creates a cxml punchout user', () => {
    at(PunchoutOverviewPage, page => page.addUser());
    at(PunchoutCreatePage, page => {
      page.fillForm({ ..._.punchoutUser, passwordConfirmation: _.punchoutUser.password });
      page.submit();
    });
    at(PunchoutOverviewPage, page => {
      page.userList.should('contain', `${_.punchoutUser.login}`);
      page.userList.should('not.contain', `Inactive`);
      page.successMessage.message.should('contain', 'created');
    });
  });

  it('admin user sets a punchout user inactive', () => {
    at(PunchoutOverviewPage, page => page.editUser(_.punchoutUser.login));
    at(PunchoutEditPage, page => {
      page.editActiveFlag(false);
      page.submit();
    });
    at(PunchoutOverviewPage, page => {
      page.userList.should('contain', `Inactive`);
    });
  });

  it('admin user creates an oci punchout user', () => {
    at(PunchoutOverviewPage, page => {
      page.selectOciTab();
      page.emptyList.should('be.visible');
      page.addUser();
    });
    at(PunchoutCreatePage, page => {
      page.fillForm({ ..._.punchoutUser2, passwordConfirmation: _.punchoutUser2.password });
      page.submit();
    });
    at(PunchoutOverviewPage, page => {
      page.userList.should('contain', `${_.punchoutUser2.login}`);
      page.userList.should('not.contain', `Inactive`);
      page.successMessage.message.should('contain', 'created');
    });
  });

  it('admin user deletes a punchout user', () => {
    at(PunchoutOverviewPage, page => {
      page.selectcXMLTab();
      cy.wait(2000);
      page.deleteUser(_.punchoutUser.login);
      page.userList.should('not.exist');
      page.emptyList.should('be.visible');
    });
  });
});
