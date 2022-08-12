import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { ProductReview } from '../../models/product-reviews/product-review.model';

import { ReviewsService } from './reviews.service';

describe('Reviews Service', () => {
  let apiServiceMock: ApiService;
  let reviewsService: ReviewsService;

  const review: ProductReview = {
    id: '1',
    authorFirstName: 'Foo',
    authorLastName: 'Bar',
    title: 'Nice',
    content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr',
    creationDate: 1652874276878,
    rating: 4,
    showAuthorNameFlag: true,
    localeID: '347',
    own: false,
  };
  const sku = '123';

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    reviewsService = TestBed.inject(ReviewsService);
  });

  it('should be created', () => {
    expect(reviewsService).toBeTruthy();
  });

  it('should get product reviews when "getProductReviews" is called', done => {
    when(apiServiceMock.get(anything(), anything())).thenReturn(of());
    when(apiServiceMock.resolveLinks()).thenReturn(() => of([review]));

    reviewsService.getProductReviews(sku).subscribe(data => {
      verify(apiServiceMock.get(`products/${sku}/reviews?attrs=own`, anything())).once();
      expect(data).toHaveProperty('reviews', [review]);
      done();
    });
  });

  it('should create a product review when "createProductReview" is called', done => {
    when(apiServiceMock.post(anything(), anything())).thenReturn(of());
    when(apiServiceMock.resolveLink()).thenReturn(() => of(review));

    reviewsService
      .createProductReview(sku, { rating: 3, title: 'Review title', content: 'Review content' })
      .subscribe(data => {
        verify(apiServiceMock.post(`products/${sku}/reviews`, anything())).once();
        expect(data).toHaveProperty('reviews', [{ ...review, own: true }]);
        done();
      });
  });

  it('should delete a product review when "deleteProductReview" is called', done => {
    when(apiServiceMock.delete(anything())).thenReturn(of({}));

    reviewsService.deleteProductReview(sku, review.id).subscribe(() => {
      verify(apiServiceMock.delete(`products/${sku}/reviews/${review.id}`)).once();
      done();
    });
  });
});
