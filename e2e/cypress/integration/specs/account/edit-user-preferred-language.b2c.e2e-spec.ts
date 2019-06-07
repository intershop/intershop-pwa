import { at } from '../../framework';
import { createUserViaREST } from '../../framework/users';
import { LoginPage } from '../../pages/account/login.page';
import { ProfileEditDetailsPage } from '../../pages/account/profile-edit-details.page';
import { ProfilePage } from '../../pages/account/profile.page';
import { SupportedLanguage, sensibleDefaults } from '../../pages/account/registration.page';

const _ = {
  user: { login: `testuser${new Date().getTime()}@test.intershop.de`, ...sensibleDefaults },
  catalog: {
    id: 'Cameras-Camcorders',
    englishName: 'Cameras',
    germanName: 'Kameras',
  },
  lang: {
    en: {
      displayName: 'English (United States)',
    },
    de: {
      selector: 'de_DE' as SupportedLanguage,
      displayName: 'German (Germany)',
    },
  },
  pageTitle: {
    englishName: 'Profile Settings',
    germanName: 'Profileinstellungen',
  },
};

describe('Changing User', () => {
  before(() => {
    createUserViaREST(_.user);

    LoginPage.navigateTo('/account/profile');
    at(LoginPage, page =>
      page
        .fillForm(_.user.login, _.user.password)
        .submit()
        .its('status')
        .should('equal', 200)
    );
  });

  it('should be able to edit preferred language', () => {
    at(ProfilePage, page => {
      page.title.should('have.text', _.pageTitle.englishName);
      page.header.topLevelCategoryLink(_.catalog.id).should('contain', _.catalog.englishName);
      page.preferredLanguage.should('have.text', _.lang.en.displayName);
      page.editDetails();
    });

    at(ProfileEditDetailsPage, page =>
      page
        .fillForm({ preferredLanguage: _.lang.de.selector })
        .submit()
        .its('status')
        .should('equal', 200)
    );
    at(ProfilePage, page => page.preferredLanguage.should('have.text', _.lang.de.displayName));
  });

  xit('should change the language of the page', () => {
    at(ProfilePage, page => {
      page.title.should('have.text', _.pageTitle.germanName);
      page.header.topLevelCategoryLink(_.catalog.id).should('contain', _.catalog.germanName);
    });
  });
});
