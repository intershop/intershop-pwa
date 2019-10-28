import { at } from '../../framework';
import { ContactConfirmationPage } from '../../pages/contact/contact-confirmation.page';
import { ContactPage } from '../../pages/contact/contact.page';

describe('Contact', () => {
  it('user should send the contact successfully', () => {
    ContactPage.navigateTo();
    at(ContactPage, page => {
      page.fillForm('Patricia Miller', 'p.miller@test.intershop.de', '12345', 'Returns', "Don't fit.");
      page.submit();
    });
    at(ContactConfirmationPage, page => {
      page.successText.contains('Thank you for your message.');
    });
  });
});
