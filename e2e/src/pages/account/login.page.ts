import { $, browser } from 'protractor';

export class LoginPage {
  readonly tag = 'ish-login-form';

  static navigateTo() {
    browser.get('/login');
  }

  loginAs(user: string, password: string) {
    $('input[data-testing-id="login"]').clear();
    $('input[data-testing-id="login"]').sendKeys(user);
    $('input[data-testing-id="password"]').clear();
    $('input[data-testing-id="password"]').sendKeys(password);
    $('button[name="login"]').click();
  }

  getError() {
    return browser
      .wait($('div.alert').isPresent())
      .then(() => $('div.alert').getText())
      .catch(() => undefined);
  }
}
