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
    when(apiServiceMock.encodeResourceId(anything())).thenCall(id => id);

    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    reviewsService = TestBed.inject(ReviewsService);
  });

  it('should be created', () => {
    expect(reviewsService).toBeTruthy();
  });

  it('should get product reviews when "getProductReviews" is called with isLoggedIn true', done => {
    when(apiServiceMock.get(anything(), anything())).thenReturn(of());
    when(apiServiceMock.resolveLinks())
      .thenReturn(() => of([]))
      .thenReturn(() => of([review]));

    reviewsService.getProductReviews(sku, true).subscribe(data => {
      verify(apiServiceMock.get(`products/${sku}/reviews`, anything())).twice();
      expect(data).toHaveProperty('reviews', [{ ...review, status: undefined }]);
      done();
    });
  });

  it('should get product reviews when "getProductReviews" is called with isLoggedIn false', done => {
    when(apiServiceMock.get(anything(), anything())).thenReturn(of());
    when(apiServiceMock.resolveLinks()).thenReturn(() => of([review]));

    reviewsService.getProductReviews(sku, false).subscribe(data => {
      verify(apiServiceMock.get(`products/${sku}/reviews`, anything())).once();
      expect(data).toHaveProperty('reviews', [review]);
      done();
    });
  });

  it('should add additional own reviews not present in all reviews', done => {
    const ownReview: ProductReview = { ...review, id: '2', own: true };
    when(apiServiceMock.get(anything(), anything())).thenReturn(of());
    when(apiServiceMock.resolveLinks())
      .thenReturn(() => of([review]))
      .thenReturn(() => of([ownReview]));

    reviewsService.getProductReviews(sku, true).subscribe(data => {
      expect(data.reviews).toHaveLength(2);
      expect(data.reviews).toContainEqual(expect.objectContaining({ id: '1' }));
      expect(data.reviews).toContainEqual(expect.objectContaining({ id: '2', own: true }));
      done();
    });
  });

  it('should return only all reviews when first call returns reviews and own call returns empty', done => {
    when(apiServiceMock.get(anything(), anything())).thenReturn(of());
    when(apiServiceMock.resolveLinks())
      .thenReturn(() => of([review]))
      .thenReturn(() => of([]));

    reviewsService.getProductReviews(sku, true).subscribe(data => {
      expect(data).toHaveProperty('reviews', [{ ...review, status: undefined }]);
      done();
    });
  });

  it('should throw error when first call returns undefined', done => {
    when(apiServiceMock.get(anything(), anything())).thenReturn(of());
    when(apiServiceMock.resolveLinks()).thenReturn(() => of(undefined));

    reviewsService.getProductReviews(sku, false).subscribe({
      error: err => {
        expect(err.message).toContain('productReviews data is required');
        done();
      },
    });
  });

  it('should throw error when called without sku', done => {
    reviewsService.getProductReviews('', false).subscribe({
      error: err => {
        expect(err.message).toContain('getProductReviews() called without sku');
        done();
      },
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
