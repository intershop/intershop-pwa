import { at } from '../../framework';
import { HomePage } from '../../pages/home.page';

describe('Cookie Consent', () => {
  describe('starting at home page', () => {
    before(() => {
      cy.clearCookie('cookieConsent');
      HomePage.navigateTo();
    });

    it('should see cookie banner', () => {
      at(HomePage, () => {
        cy.get('.cookies-banner').should('contain', 'Your privacy is important for us');
      });
    });

    it('should accept all cookies', () => {
      at(HomePage, () => {
        cy.get('[data-testing-id="acceptAllButton"]').click();
        cy.wait(4000);

        cy.getCookies().then(cookies => {
          expect(cookies[cookies.length - 1]).to.have.property('name', 'cookieConsent');
          cy.wait(500);
          cy.get('.cookies-banner').should('not.exist');
        });
      });
    });

    it('should manage cookies', () => {
      at(HomePage, page => {
        page.footer.manageCookies();
        cy.get('.cookies-modal').should('contain', 'cookies are necessary');
      });
    });
  });
});
