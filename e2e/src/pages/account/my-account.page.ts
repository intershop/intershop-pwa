import { browser } from 'protractor';
import { HeaderModule } from '../header.module';

export class MyAccountPage {
  readonly tag = 'ish-account-page';

  readonly header = new HeaderModule();

  static navigateTo() {
    browser.get('/account');
  }
}
