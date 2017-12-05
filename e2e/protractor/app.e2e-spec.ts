import { browser } from 'protractor';
import { ProofOfConceptPage } from './app.po';

describe('proof-of-concept App', () => {
  let page: ProofOfConceptPage;
  const telephoneNumber: String = '1300 032 032';

  beforeEach(() => {
    page = new ProofOfConceptPage();
  });

  it(`should display telephone number "${telephoneNumber}" on home page`, done => {
    page.navigateTo();

    // disable waiting for Angular to finish page changes since the Carousel on the homepage will not finish
    // otherwise selecting of elements to compare the content will not work
    // https://github.com/angular/protractor/blob/master/docs/timeouts.md#how-to-disable-waiting-for-angular
    browser.waitForAngularEnabled(false);

    page.getCustomerInfo()
      .then(msg => expect(msg).toEqual(telephoneNumber))
      .then(done, done.fail);
  });
});
