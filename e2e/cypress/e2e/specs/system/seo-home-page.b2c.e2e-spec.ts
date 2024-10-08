import { at } from '../../framework';
import { HomePage } from '../../pages/home.page';
import { NotFoundPage } from '../../pages/shopping/not-found.page';

describe('Page Meta', () => {
  before(() => HomePage.navigateTo());

  it('should have all metadata set on home page', () => {
    at(HomePage, page => {
      page.metaData.check({
        title: 'inTRONICS Home | Intershop PWA',
        url: /.*\/home$/,
        description: 'inTRONICS Home description ...',
      });
    });
  });

  it('should switch to error page meta when navigating there', () => {
    at(HomePage, page => {
      page.footer.gotoErrorPage();
    });
    at(NotFoundPage, page => {
      page.metaData.check({
        title: 'Error | Intershop PWA',
        url: /.*\/error$/,
        description: 'Intershop - Progressive Web App',
      });
    });
  });
});
