import { at, waitLoadingEnd } from '../../framework';
import { createUserViaREST } from '../../framework/users';
import { LoginPage } from '../../pages/account/login.page';
import { MyAccountPage } from '../../pages/account/my-account.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { FamilyPage } from '../../pages/shopping/family.page';

const _ = {
  user: { login: `testuser${new Date().getTime()}@test.intershop.de`, ...sensibleDefaults },
  category: 'Cameras-Camcorders.832',
  product: '8182790134362',
};

describe('Logged in Sleeping User', () => {
  before(() => createUserViaREST(_.user));

  describe('being a long time on a family page', () => {
    it('should wait a long time on family page after logging in', () => {
      LoginPage.navigateTo('/category/' + _.category);
      at(LoginPage, page => page.fillForm(_.user.login, _.user.password).submit().its('status').should('equal', 200));
      at(FamilyPage, page => {
        waitLoadingEnd(3000);
        page.productList.productTile(_.product).should('be.visible');
        page.header.myAccountLink.should('have.text', `${_.user.firstName} ${_.user.lastName}`);
      });
    });

    it('should not go to error page but get logged out when clicking on product after a long time', () => {
      cy.server()
        .route({
          method: 'GET',
          url: `**/products/${_.product}*`,
          status: 400,
          response: 'Bad Request (AuthenticationTokenInvalid)',
        })
        .as('invalid');
      at(FamilyPage, page => {
        page.productList.gotoProductDetailPageBySku(_.product, () => cy.wait('@invalid'));
        cy.route({
          method: 'GET',
          url: `**/products/${_.product}*`,
        });

        cy.wait(5000);
      });
      at(LoginPage, page => {
        page.header.myAccountLink.should('not.have.text', `${_.user.firstName} ${_.user.lastName}`);
        page.infoText.should('contain.text', 'logged out automatically');
      });
    });
  });

  describe('being a long time on a myaccount page', () => {
    it('should wait a long time on myaccount page after logging in', () => {
      LoginPage.navigateTo();
      at(LoginPage, page => page.fillForm(_.user.login, _.user.password).submit().its('status').should('equal', 200));
      at(MyAccountPage, page => {
        page.header.myAccountLink.should('have.text', `${_.user.firstName} ${_.user.lastName}`);
      });
    });

    it('should go to login page and get logged out when clicking on addresses after a long time', () => {
      cy.server()
        .route({
          method: 'GET',
          url: `**`,
          status: 400,
          response: 'Bad Request (AuthenticationTokenInvalid)',
        })
        .as('invalid');
      at(MyAccountPage, page => {
        page.navigateToAddresses();
        cy.wait('@invalid');
        cy.route({
          method: 'GET',
          url: `**`,
        });
        cy.wait(5000);
      });
      at(LoginPage, page => {
        page.header.myAccountLink.should('not.have.text', `${_.user.firstName} ${_.user.lastName}`);
        page.infoText.should('contain.text', 'logged out automatically');
      });
    });
  });
});
