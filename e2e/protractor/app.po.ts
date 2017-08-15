import { browser, by, element } from 'protractor';

export class ProofOfConceptPage {
  navigateTo() {
    return browser.get('/');
  }

  getCustomerInfo() {
    return element(by.css('.customer-info')).getText();
  }
}
