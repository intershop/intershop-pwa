import { ProductReviewsHelper } from './product-reviews.helper';
import { ProductReviews } from './product-reviews.model';

describe('Product Reviews Helper', () => {
  describe('equal', () => {
    it.each([
      [false, undefined, undefined],
      [false, { sku: 'test' } as ProductReviews, undefined],
      [false, undefined, { sku: 'test' } as ProductReviews],
      [false, { sku: 'test' } as ProductReviews, { sku: 'other' } as ProductReviews],
      [true, { sku: 'test' } as ProductReviews, { sku: 'test' } as ProductReviews],
    ])(`should return %s when comparing %j and %j`, (expected, o1, o2) => {
      expect(ProductReviewsHelper.equal(o1, o2)).toEqual(expected);
    });
  });
});
