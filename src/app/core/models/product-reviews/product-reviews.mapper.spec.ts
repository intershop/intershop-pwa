import { ProductReviewData } from './product-reviews.interface';
import { ProductReviewsMapper } from './product-reviews.mapper';

describe('Product Reviews Mapper', () => {
  beforeEach(() => {});

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => ProductReviewsMapper.fromData(undefined, '')).toThrow();
    });

    it('should map incoming data to model data', () => {
      const data: ProductReviewData = {
        id: '',
        type: '',
        authorFirstName: '',
        authorLastName: '',
        title: '',
        content: '',
        creationDate: 0,
        rating: 0,
        showAuthorNameFlag: true,
        localeID: '',
      };
      const mapped = ProductReviewsMapper.fromData([data], '123');
      expect(mapped).toHaveProperty([], data);
      expect(mapped).not.toHaveProperty('otherField');
    });
  });
});
