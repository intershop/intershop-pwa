import { fillFormField, waitLoadingEnd } from '../../framework';

declare interface ProductReviewForm {
  rating: number;
  title: string;
  content: string;
}

export class ProductReviewModule {
  // product rating&reviews
  get productReviewList() {
    return cy.get('[data-testing-id=product-review-list]');
  }

  get reviewLoginLink() {
    return cy.get('ish-product-reviews').find('[data-testing-id=login-link]');
  }

  get reviewOpenDialogLink() {
    return cy.get('ish-product-reviews').find('[data-testing-id=open-review-dialog]');
  }

  get reviewCreationForm() {
    return cy.get('[data-testing-id="create-product-review-form"]');
  }

  get ownProductReview() {
    return cy.get('[data-testing-id=own-product-review');
  }

  get deleteReviewLink() {
    return cy.get('[data-testing-id=delete-review]');
  }

  gotoLoginBeforeOpenReviewDialog() {
    this.reviewLoginLink.click();
  }

  fillReviewForm(data: ProductReviewForm) {
    this.reviewCreationForm.find(`[data-testing-id=rating-stars-field] :nth-child(${data.rating})`).click();

    Object.keys(data)
      .filter(key => data[key] !== undefined && key !== 'rating')
      .forEach((key: keyof ProductReviewForm) => {
        fillFormField('[data-testing-id="create-product-review-form"]', key, data[key]);
      });

    return this;
  }

  submitReviewCreationForm() {
    cy.get('[data-testing-id="create-product-review-form"] button[type=submit]').click();
  }

  deleteOwnReview() {
    this.deleteReviewLink.click();
    cy.get('[data-testing-id="confirm"]', { timeout: 1000 }).click();
    waitLoadingEnd(1000);
  }
}
