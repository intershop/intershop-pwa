import { $ } from 'protractor';

export class HeaderModule {
  getNumberOfCompareItems() {
    return $('#compare-count')
      .getText()
      .then(s => Number.parseInt(s));
  }
}
