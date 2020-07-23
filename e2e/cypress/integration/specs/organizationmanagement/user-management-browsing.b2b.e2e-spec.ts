import { at } from '../../framework';
import { LoginPage } from '../../pages/account/login.page';
import { UsersDetailPage } from '../../pages/organizationmanagement/users-detail.page';
import { UsersPage } from '../../pages/organizationmanagement/users.page';

// test for viewing functionality only

const _ = {
  user: {
    name: 'Bernhard Boldner',
    email: 'bboldner@test.intershop.de',
    password: '!InterShop00!',
    role: 'Account Admin',
  },
  selectedUser: {
    name: 'Patricia Miller',
    email: 'pmiller@test.intershop.de',
    role: 'Buyer',
    permission: 'Manage Purchases',
  },
};

describe('User Management', () => {
  it('should start user management by logging in', () => {
    LoginPage.navigateTo('/account/organization/users');
    at(LoginPage, page => {
      page.fillForm(_.user.email, _.user.password);
      page.submit().its('status').should('equal', 200);
    });
    at(UsersPage, page => {
      page.usersList.should('contain', `${_.user.name}`);
      page.rolesOfUser(_.user.email).should('contain', _.user.role);
      page.rolesOfUser(_.selectedUser.email).should('contain', _.selectedUser.role);
    });
  });

  it('should be able to see user details', () => {
    at(UsersPage, page => {
      page.goToUserDetailLink(_.selectedUser.email);
    });
    at(UsersDetailPage, page => {
      page.name.should('contain', `${_.selectedUser.name}`);
      page.email.should('have.text', `${_.selectedUser.email}`);
      page.rolesAndPermissions.should('not.contain', _.user.role);
      page.rolesAndPermissions.should('contain', _.selectedUser.role);
      page.rolesAndPermissions.should('contain', _.selectedUser.permission);
    });
  });
});
