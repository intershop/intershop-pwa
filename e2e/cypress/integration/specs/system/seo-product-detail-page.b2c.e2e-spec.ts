import { at } from '../../framework';
import { HomePage } from '../../pages/home.page';
import { NotFoundPage } from '../../pages/shopping/not-found.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

describe('Product Detail Page Meta', () => {
  before(() => ProductDetailPage.navigateTo('201807171'));

  it('should have all metadata set on product detail page', () => {
    at(ProductDetailPage, page => {
      page.metaData.check({
        title: 'Google Home - Smart Home favorable buying at our shop | Intershop PWA',
        url: /.*\/sku201807171/,
        description: 'Google Home - Hands-free help from the Google Assistant',
        'og:image': /.*201807171_front.*/,
      });
    });
  });

  it('should switch to home page meta when navigating there', () => {
    at(ProductDetailPage, page => {
      page.header.gotoHomePage();
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
