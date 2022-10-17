import { at } from '../../framework';
import { createB2BUserViaREST } from '../../framework/b2b-user';
import { LoginPage } from '../../pages/account/login.page';
import { sensibleDefaults } from '../../pages/account/registration.page';
import { ProductDetailPage } from '../../pages/shopping/product-detail.page';

const _ = {
  user: {
    login: `test${new Date().getTime()}@testcity.de`,
    ...sensibleDefaults,
  },
  product: {
    sku: '6997041',
  },
};

describe('Product Reviews', () => {
  before(() => {
    createB2BUserViaREST(_.user);
    ProductDetailPage.navigateTo(_.product.sku);
  });

  it('anonymous user should see a product review on product review tab', () => {
    at(ProductDetailPage, page => {
      page.infoNav('Reviews').should('be.visible');
      page.infoNav('Reviews').click();
      page.reviewTab.productReviewList.should('be.visible');
      page.reviewTab.deleteReviewLink.should('not.exist');
    });
  });

  it('user should log in before he can write a review', () => {
    at(ProductDetailPage, page => {
      page.reviewTab.reviewOpenDialogLink.should('not.exist');
      page.reviewTab.ownProductReview.should('not.exist');
      page.reviewTab.gotoLoginBeforeOpenReviewDialog();
    });
    at(LoginPage, page => {
      page.fillForm(_.user.login, _.user.password);
      page.submit().its('response.statusCode').should('equal', 200);
    });
    at(ProductDetailPage, page => {
      page.reviewTab.reviewOpenDialogLink.should('be.visible');
    });
  });

  it('user should be able to write a review', () => {
    at(ProductDetailPage, page => {
      page.reviewTab.reviewOpenDialogLink.click();
      page.reviewTab.reviewCreationForm.should('be.visible');

      page.reviewTab.fillReviewForm({ rating: 2, title: 'Disappointment', content: 'Bad quality' });
      page.reviewTab.submitReviewCreationForm();

      page.infoText.should('contain', 'needs to be approved');
      page.reviewTab.ownProductReview.should('exist');
      page.reviewTab.ownProductReview.should('contain', 'Disappointment');
    });
  });

  it('user should be able to delete his/her review', () => {
    at(ProductDetailPage, page => {
      page.reviewTab.deleteReviewLink.should('be.visible');
      page.reviewTab.deleteOwnReview();

      page.reviewTab.deleteReviewLink.should('not.exist');
      page.reviewTab.reviewOpenDialogLink.should('be.visible');
    });
  });
});
