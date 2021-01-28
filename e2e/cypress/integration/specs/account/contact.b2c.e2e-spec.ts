import { at } from '../../framework';
import { LoginPage } from '../../pages/account/login.page';
import { ContactConfirmationPage } from '../../pages/contact/contact-confirmation.page';
import { ContactPage } from '../../pages/contact/contact.page';

const _ = {
  email: 'patricia@test.intershop.de',
  password: '!InterShop00!',
  fullName: 'Patricia Miller',
  formContent: {
    phone: '12345',
    subject: 'Returns',
    comment: "Don't fit.",
  },
};

describe('Contact', () => {
  it('anonymous user should send the contact successfully', () => {
    ContactPage.navigateTo();
    at(ContactPage, page => {
      page.fillForm({ ..._.formContent, email: _.email, name: _.fullName });
      page.submit();
    });
    at(ContactConfirmationPage, page => {
      page.successText.contains('Thank you for your message.');
    });
  });

  it('logged in user should see his data already entered in the form', () => {
    LoginPage.navigateTo('/contact');
    at(LoginPage, page => {
      page.fillForm(_.email, _.password);
      page.submit().its('response.statusCode').should('equal', 200);
    });
    at(ContactPage, page => {
      page.emailInput.should('have.value', _.email);
      page.nameInput.should('have.value', _.fullName);
    });
  });
});
