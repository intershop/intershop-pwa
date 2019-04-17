import { at } from '../../framework';
import { HomePage } from '../../pages/home.page';

const _ = {
  catalog: {
    id: 'Cameras-Camcorders',
    englishName: 'Cameras',
    germanName: 'Kameras',
  },
};

describe('Language Changing User', () => {
  describe('starting at home page', () => {
    before(() => HomePage.navigateTo());

    it('should see english categories', () => {
      at(HomePage, page => {
        page.header.topLevelCategoryLink(_.catalog.id).should('contain', _.catalog.englishName);
      });
    });

    it('when switching to german', () => {
      at(HomePage, page => {
        page.header.switchLanguage('German');
      });
    });

    it('should see german categories', () => {
      at(HomePage, page => {
        page.header.topLevelCategoryLink(_.catalog.id).should('contain', _.catalog.germanName);
      });
    });
  });
});
