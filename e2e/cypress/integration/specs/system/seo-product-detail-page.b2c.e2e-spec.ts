import { at, waitLoadingEnd } from '../../framework';
import { HomePage } from '../../pages/home.page';
import { FamilyPage } from '../../pages/shopping/family.page';
import { NotFoundPage } from '../../pages/shopping/not-found.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

describe('Page Meta', () => {
  before(() => ProductDetailPage.navigateTo('201807171'));

  it('should have all metadata set on product detail page', () => {
    at(ProductDetailPage, page => {
      waitLoadingEnd(1000);
      page.metaData.check({
        title: 'Google Home - Smart Home | Intershop PWA',
        url: /.*\/Smart-Home\/Google-Home-sku201807171-catHome-Entertainment.SmartHome$/,
        description: 'Google Home - Hands-free help from the Google Assistant',
        'og:image': /.*201807171_front.*/,
      });
    });
  });

  it('should switch to family page meta when navigating there', () => {
    at(ProductDetailPage, page => {
      page.breadcrumb.items.eq(2).click();
      waitLoadingEnd(1000);
    });
    at(FamilyPage, page => {
      page.metaData.check({
        title: 'Smart Home - Home Entertainment | Intershop PWA',
        url: /.*\/Smart-Home-catHome-Entertainment.SmartHome$/,
        description: 'Smart Home, Hands-free help from the Google AssistantSmart HomeHome Entertainment',
      });
    });
  });

  it('should switch to home page meta when navigating there', () => {
    at(FamilyPage, page => {
      page.header.gotoHomePage();
      waitLoadingEnd(1000);
    });
    at(HomePage, page => {
      page.metaData.check({
        title: 'inTRONICS Home | Intershop PWA',
        url: /.*\/home$/,
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
        url: /.*\/error$/,
        description: 'Intershop - Progressive Web App - Demo PWA',
      });
    });
  });
});
