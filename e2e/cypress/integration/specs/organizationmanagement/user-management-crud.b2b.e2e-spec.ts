import { at } from '../../framework';
import { createB2BUserViaREST } from '../../framework/b2b-user';
import { LoginPage } from '../../pages/account/login.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { UserCreatePage } from '../../pages/organizationmanagement/user-create.page';
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
    at(UsersPage, page => {
      page.usersList.should('contain', `${_.newUser.firstName}`);
    });
  });

  it('should be able to edit user', () => {
    at(UsersPage, page => page.goToUser(`${_.newUser.firstName} ${_.newUser.lastName}`));
    at(UsersDetailPage, page => {
      page.name.should('contain', `${_.newUser.firstName} ${_.newUser.lastName}`);
      page.editUser();
    });
    at(UserEditPage, page => {
      page.editTitle(_.editUser.title);
      page.editFirstName(_.editUser.firstName);
      page.submit();
    });
    at(UsersDetailPage, page => {
      page.name.should('contain', `${_.editUser.firstName} ${_.newUser.lastName}`);
      page.goToUserManagement();
    });
  });

  it('should be able to delete user', () => {
    at(UsersPage, page => {
      page.usersList.should('contain', `${_.editUser.firstName}`);
      page.deleteUser(`${_.editUser.firstName} ${_.newUser.lastName}`);
      page.usersList.should('not.contain', `${_.editUser.firstName}`);
      page.usersList.should('contain', `${_.user.firstName}`);
    });
  });
});
