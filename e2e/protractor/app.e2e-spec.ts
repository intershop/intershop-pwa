import { browser } from 'protractor';
import { ProofOfConceptPage } from './app.po';

describe('proof-of-concept App', () => {
  let page: ProofOfConceptPage;
  let text: String;

  beforeEach(() => {
    page = new ProofOfConceptPage();
    text = '1300 032 032';
  });

  it('check telephone number is "1300 032 032"', done => {
    page.navigateTo();

    // disable waiting for Angular to finish page changes since the Carousel on the homepage will not finish
    // otherwise selecting of elements to compare the content will not work
    // https://github.com/angular/protractor/blob/master/docs/timeouts.md#how-to-disable-waiting-for-angular
    browser.waitForAngularEnabled(false);

    page.getCustomerInfo()
      .then(msg => expect(msg).toEqual(text))
      .then(done, done.fail);
  });
});
