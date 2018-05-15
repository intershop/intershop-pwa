import { at } from '../framework';
import { LoginPage } from '../pages/account/login.page';
import { MyAccountPage } from '../pages/account/my-account.page';
import { HomePage } from '../pages/home.page';

describe('Returning User', () => {
  describe('with valid password', () => {
    beforeAll(() => HomePage.navigateTo());

    it('should press login and be routed to login page', () => {
      at(HomePage, page => {
        page.header.gotoLoginPage();
      });
      at(LoginPage);
    });

    it('should enter credentials and submit and be directed to my-account', () => {
      at(LoginPage, page => {
        expect(page.getError()).toBeFalsy();
        page.loginAs('patricia@test.intershop.de', '!InterShop00!');
      });
      at(MyAccountPage);
    });

    it('should logout and be redirected to home page', () => {
      at(MyAccountPage, page => {
        page.header.logout();
      });
      at(HomePage);
    });
  });

  describe('with wrong password', () => {
    beforeAll(() => LoginPage.navigateTo());

    it('should enter wrong credentials and submit and be be still at login page', () => {
      at(LoginPage, page => {
        page.loginAs('patricia@test.intershop.de', 'wrong');
      });
      at(LoginPage, page => {
        expect(page.getError()).toBeTruthy();
      });
    });
  });
});
