import { ProductReview } from './product-review.model';
import { ProductReviewsMapper } from './product-reviews.mapper';

describe('Product Reviews Mapper', () => {
  beforeEach(() => {});

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => ProductReviewsMapper.fromData('', undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const data: ProductReview[] = [
        {
          id: '1',
          authorFirstName: 'Foo',
          authorLastName: 'Bar',
          title: 'Nice',
          content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr',
          creationDate: 1652874276878,
          rating: 4,
          showAuthorNameFlag: true,
          localeID: '347',
        },
        {
          id: '2',
          authorFirstName: 'Foo',
          authorLastName: 'Baz',
          title: 'Great',
          content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr',
          creationDate: 1652874276878,
          rating: 5,
          showAuthorNameFlag: false,
          localeID: '235',
        },
      ];
      const mapped = ProductReviewsMapper.fromData('123', data);
      expect(mapped).toHaveProperty('reviews', data);
      expect(mapped).toHaveProperty('sku', '123');
    });
  });
});
