import { at } from '../../framework';
import { createB2BUserViaREST } from '../../framework/b2b-user';
import { mockQuotes } from '../../framework/quote-mock';
import { LoginPage } from '../../pages/account/login.page';
import { MyAccountPage } from '../../pages/account/my-account.page';
import { QuoteDetailPage } from '../../pages/account/quote-detail.page';
import { QuoteListPage } from '../../pages/account/quote-list.page';
import { sensibleDefaults } from '../../pages/account/registration.page';

const _ = {
  user: {
    login: `test${new Date().getTime()}@testcity.de`,
    ...sensibleDefaults,
  },
};

describe('Quote MyAccount Display', () => {
  before(() => {
    createB2BUserViaREST(_.user);
    LoginPage.navigateTo();
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page.submit().its('status').should('equal', 200);
    });
  });
  beforeEach(() => {
    mockQuotes();
  });

  it('check counter for newQuotes in my quotes table ', () => {
    at(MyAccountPage, page => {
      page.newQuoteLabel.should('have.text', '1');
    });
  });

  it('check counter for submittedQuotes in my quotes table ', () => {
    at(MyAccountPage, page => {
      page.submittedQuoteLabel.should('have.text', '1');
    });
  });

  it('check counter for acceptedQuotes in my quotes table ', () => {
    at(MyAccountPage, page => {
      page.acceptedQuoteLabel.should('have.text', '2');
    });
  });

  it('check counter for rejectedQuotes in my quotes table ', () => {
    at(MyAccountPage, page => {
      page.rejectedQuoteLabel.should('have.text', '1');
    });
  });

  it('check quote detail page properties for responded quote', () => {
    at(MyAccountPage, page => {
      page.navigateToQuoting();
    });
    at(QuoteListPage, page => {
      page.goToQuoteDetailLink('quoteResponded');
    });
    at(QuoteDetailPage, page => {
      page.quoteState.should('contain', 'Responded');
      page.header.goToMyAccount();
    });
  });

  it('check quote detail page properties for expired quote', () => {
    at(MyAccountPage, page => {
      page.navigateToQuoting();
    });
    at(QuoteListPage, page => {
      page.goToQuoteDetailLink('quoteExpired');
    });
    at(QuoteDetailPage, page => {
      page.quoteState.should('contain', 'Expired');
      page.header.goToMyAccount();
    });
  });

  it('check quote detail page properties for Rejected quote and logs out', () => {
    at(MyAccountPage, page => {
      page.navigateToQuoting();
    });
    at(QuoteListPage, page => {
      page.goToQuoteDetailLink('quoteRejected');
    });
    at(QuoteDetailPage, page => {
      page.quoteState.should('contain', 'Rejected');
      page.header.logout();
    });
  });
});
