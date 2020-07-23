import { at } from '../../framework';
import { createB2BUserViaREST } from '../../framework/b2b-user';
import { LoginPage } from '../../pages/account/login.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { UserCreatePage } from '../../pages/organizationmanagement/user-create.page';
import { UserEditRolesPage } from '../../pages/organizationmanagement/user-edit-roles.page';
import { UserEditPage } from '../../pages/organizationmanagement/user-edit.page';
import { UsersDetailPage } from '../../pages/organizationmanagement/users-detail.page';
import { UsersPage } from '../../pages/organizationmanagement/users.page';

// test for viewing functionality only

const _ = {
  user: {
    login: `test${new Date().getTime()}@testcity.de`,
    ...sensibleDefaults,
  },
  newUser: {
    title: 'Mr.',
    firstName: 'John',
    lastName: 'Doe',
    phone: '5551234',
    email: `j.joe${new Date().getTime()}@testcity.de`,
  },
  roles: {
    autoRole: 'Buyer',
    assignedRole: 'Account Admin',
  },
  editUser: {
    title: 'Ms.',
    firstName: 'Jane',
  },
};

describe('User Management - CRUD', () => {
  before(() => {
    createB2BUserViaREST(_.user);
  });

  it('should start user management by logging in', () => {
    LoginPage.navigateTo('/account/organization/users');
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page.submit().its('status').should('equal', 200);
    });
    at(UsersPage, page => {
      page.usersList.should('contain', `${_.user.firstName}`);
    });
  });

  it('should be able to create a new user', () => {
    at(UsersPage, page => page.addUser());
    at(UserCreatePage, page => {
      page.fillForm(_.newUser);
      page.submit();
    });
    at(UsersDetailPage, page => {
      page.name.should('contain', `${_.newUser.firstName} ${_.newUser.lastName}`);
      page.rolesAndPermissions.should('contain', _.roles.autoRole);
    });
  });

  it('should be able to edit user details', () => {
    at(UsersDetailPage, page => page.editUser());
    at(UserEditPage, page => {
      page.editTitle(_.editUser.title);
      page.editFirstName(_.editUser.firstName);
      page.submit();
    });
    at(UsersDetailPage, page => {
      page.name.should('contain', `${_.editUser.firstName} ${_.newUser.lastName}`);
    });
  });

  it('should be able to edit user roles', () => {
    at(UsersDetailPage, page => page.editRoles());
    at(UserEditRolesPage, page => {
      page.checkRole(_.roles.assignedRole);
      page.submit();
    });
    at(UsersDetailPage, page => {
      page.rolesAndPermissions.should('contain', _.roles.assignedRole);
      page.rolesAndPermissions.should('contain', _.roles.autoRole);
    });
  });

  it('should be able to delete user', () => {
    at(UsersDetailPage, page => page.goToUserManagement());
    at(UsersPage, page => {
      page.usersList.should('contain', `${_.editUser.firstName}`);
      page.rolesOfUser(_.newUser.email).should('contain', _.roles.autoRole);
      page.rolesOfUser(_.newUser.email).should('contain', _.roles.assignedRole);

      page.deleteUser(`${_.editUser.firstName} ${_.newUser.lastName}`);

      page.usersList.should('not.contain', `${_.editUser.firstName}`);
      page.usersList.should('contain', `${_.user.firstName}`);
    });
  });
});
