import { at } from '../../framework';
import { HomePage } from '../../pages/home.page';

describe('Cookie Consent', () => {
  describe('starting at home page', () => {
    before(() => {
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
        cy.wait(3000);

        cy.getCookies().then(cookies => {
          expect(cookies[cookies.length - 1]).to.have.property('name', 'cookieConsent');
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
