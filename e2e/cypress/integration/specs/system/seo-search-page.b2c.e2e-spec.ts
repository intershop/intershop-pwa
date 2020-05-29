import { at, waitLoadingEnd } from '../../framework';
import { HomePage } from '../../pages/home.page';
import { NotFoundPage } from '../../pages/shopping/not-found.page';
import { SearchResultPage } from '../../pages/shopping/search-result.page';

describe('Product Detail Page Meta', () => {
  before(() => SearchResultPage.navigateTo('kodak'));

  it('should have all metadata set on product detail page', () => {
    at(SearchResultPage, page => {
      waitLoadingEnd(1000);
      page.metaData.check({
        title: "Search Result for 'kodak' | Intershop PWA",
        url: /\/search\/kodak.*/,
        description: 'Intershop - Progressive Web App - Demo PWA',
      });
    });
  });

  it('should switch to home page meta when navigating there', () => {
    at(SearchResultPage, page => {
      page.header.gotoHomePage();
      waitLoadingEnd(1000);
    });
    at(HomePage, page => {
      page.metaData.check({
        title: 'inTRONICS Home | Intershop PWA',
        url: /.*\/home/,
        description: 'inTRONICS home description ...',
      });
    });
  });

  it('should switch to error page meta when navigating there', () => {
    at(HomePage, page => {
      page.footer.gotoErrorPage();
      waitLoadingEnd(1000);
    });
    at(NotFoundPage, page => {
      page.metaData.check({
        title: 'Error | Intershop PWA',
        url: /.*\/error/,
        description: 'Intershop - Progressive Web App - Demo PWA',
      });
    });
  });
});
