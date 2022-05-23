import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { ProductReview } from 'ish-core/models/product-reviews/product-review.model';
import { ApiService } from 'ish-core/services/api/api.service';

import { ReviewsService } from './reviews.service';

describe('Reviews Service', () => {
  let apiServiceMock: ApiService;
  let reviewsService: ReviewsService;

  let review: ProductReview = {
    id: '1',
    authorFirstName: 'Foo',
    authorLastName: 'Bar',
    title: 'Nice',
    content: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr',
    creationDate: 1652874276878,
    rating: 4,
    showAuthorNameFlag: true,
    localeID: '347',
  };

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }, provideMockStore({})],
    });
    reviewsService = TestBed.inject(ReviewsService);
  });

  it('should be created', () => {
    expect(reviewsService).toBeTruthy();
  });

  it('should get product reviews when "getProductReviews" is called', done => {
    const sku = '123';
    when(apiServiceMock.get(`products/${sku}/reviews`)).thenReturn(of());
    when(apiServiceMock.resolveLinks()).thenReturn(() => of([review]));

    reviewsService.getProductReviews(sku).subscribe(data => {
      verify(apiServiceMock.get(`products/123/reviews`)).once();
      expect(data).toHaveProperty('reviews', [review]);
      done();
    });
  });
});
