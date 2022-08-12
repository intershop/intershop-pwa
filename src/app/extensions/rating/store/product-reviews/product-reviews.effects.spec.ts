import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of, throwError } from 'rxjs';
import { anyString, anything, capture, instance, mock, verify, when } from 'ts-mockito';

import { displayInfoMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import { loadProduct } from 'ish-core/store/shopping/products';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { ProductReview, ProductReviewCreationType } from '../../models/product-reviews/product-review.model';
import { ProductReviews } from '../../models/product-reviews/product-reviews.model';
import { ReviewsService } from '../../services/reviews/reviews.service';

import {
  createProductReview,
  createProductReviewFail,
  createProductReviewSuccess,
  deleteProductReview,
  deleteProductReviewFail,
  deleteProductReviewSuccess,
  loadProductReviews,
  loadProductReviewsFail,
  loadProductReviewsSuccess,
} from './product-reviews.actions';
import { ProductReviewsEffects } from './product-reviews.effects';

describe('Product Reviews Effects', () => {
  let actions$: Observable<Action>;
  let effects: ProductReviewsEffects;
  let reviewsServiceMock: ReviewsService;

  const review: ProductReviewCreationType = { rating: 3, title: 'review title', content: 'review content' };
  const reviews: ProductReviews = {
    sku: '123',
    reviews: [{ id: '123', rating: 3, title: 'review title', content: 'review content' } as ProductReview],
  };

  beforeEach(() => {
    reviewsServiceMock = mock(ReviewsService);
    when(reviewsServiceMock.getProductReviews(anything())).thenCall((sku: string) => of({ sku, reviews: [] }));
    when(reviewsServiceMock.createProductReview(anything(), anything())).thenReturn(of(reviews));
    when(reviewsServiceMock.deleteProductReview(anything(), anything())).thenReturn(of(undefined));

    TestBed.configureTestingModule({
      providers: [
        { provide: ReviewsService, useFactory: () => instance(reviewsServiceMock) },
        ProductReviewsEffects,
        provideMockActions(() => actions$),
      ],
    });

    effects = TestBed.inject(ProductReviewsEffects);
  });

  describe('loadProductReviews$', () => {
    it('should not dispatch actions when encountering loadProductReviews', done => {
      const action = loadProductReviews({ sku: '123' });
      actions$ = of(action);

      effects.loadProductReviews$.subscribe(() => {
        const sku = capture(reviewsServiceMock.getProductReviews);
        expect(sku).toEqual(sku);
        done();
      });
    });

    it('should map invalid request to action of type loadProductReviewsFail', () => {
      when(reviewsServiceMock.getProductReviews(anything())).thenReturn(
        throwError(() => makeHttpError({ message: 'invalid' }))
      );
      const action = loadProductReviews({ sku: '123' });
      const completion = loadProductReviewsFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductReviews$).toBeObservable(expected$);
    });

    it('should map to action of type loadProductReviewsSuccess', () => {
      const reviews: ProductReviews = {
        sku: '123',
        reviews: [],
      };

      const action = loadProductReviews({ sku: '123' });
      const completion = loadProductReviewsSuccess({ reviews });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadProductReviews$).toBeObservable(expected$);
    });
  });

  describe('createProductReview$', () => {
    it('should call the service when CreateProductReview event is called', done => {
      const action = createProductReview({ sku: '123', review });
      actions$ = of(action);
      effects.createProductReview$.subscribe(() => {
        verify(reviewsServiceMock.createProductReview('123', anything())).once();
        done();
      });
    });

    it('should dispatch a CreateProductReviewSuccess action on success without approval', () => {
      const action = createProductReview({ sku: '123', review });
      const completion1 = createProductReviewSuccess({ reviews });

      const completion2 = displaySuccessMessage({
        message: 'product.reviews.create.success.message',
        messageParams: { '0': 'review title' },
      });
      const completion3 = loadProduct({ sku: '123' });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cde)', { c: completion1, d: completion2, e: completion3 });

      expect(effects.createProductReview$).toBeObservable(expected$);
    });

    it('should dispatch a CreateProductReviewSuccess action on success with approval', () => {
      const newReviews = {
        sku: '123',
        reviews: [
          { id: '123', rating: 3, title: 'review title', content: 'review content', status: 'NEW' } as ProductReview,
        ],
      };

      when(reviewsServiceMock.createProductReview(anything(), anything())).thenReturn(of(newReviews));

      const action = createProductReview({ sku: '123', review });
      const completion1 = createProductReviewSuccess({
        reviews: newReviews,
      });

      const completion2 = displayInfoMessage({
        message: 'product.reviews.create.approval.message',
        messageParams: { '0': 'review title' },
      });
      const completion3 = loadProduct({ sku: '123' });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cde)', { c: completion1, d: completion2, e: completion3 });

      expect(effects.createProductReview$).toBeObservable(expected$);
    });

    it('should dispatch a CreateProductReviewFail action on failed', () => {
      const error = makeHttpError({ status: 401, code: 'error' });
      when(reviewsServiceMock.createProductReview(anyString(), anything())).thenReturn(throwError(() => error));

      const action = createProductReview({ sku: '123', review });
      const completion = createProductReviewFail({
        error,
      });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });
      expect(effects.createProductReview$).toBeObservable(expected$);
    });
  });

  describe('deleteProductReview$', () => {
    const review = { id: 'xyz', rating: 3, title: 'review title', content: 'review content' } as ProductReview;

    it('should call the service when DeleteProductReview event is called', done => {
      const action = deleteProductReview({ sku: '123', review });
      actions$ = of(action);
      effects.deleteProductReview$.subscribe(() => {
        verify(reviewsServiceMock.deleteProductReview('123', anything())).once();
        done();
      });
    });

    it('should dispatch a DeleteProductReviewSuccess action on successful', () => {
      const action = deleteProductReview({ sku: '123', review });
      const completion1 = deleteProductReviewSuccess({ sku: '123', review });

      const completion2 = displaySuccessMessage({
        message: 'product.reviews.delete.success.message',
        messageParams: { '0': 'review title' },
      });
      const completion3 = loadProduct({ sku: '123' });

      actions$ = hot('-a', { a: action });
      const expected$ = cold('-(cde)', { c: completion1, d: completion2, e: completion3 });

      expect(effects.deleteProductReview$).toBeObservable(expected$);
    });

    it('should dispatch a DeleteProductReviewFail action on failed', () => {
      const error = makeHttpError({ status: 401, code: 'error' });
      when(reviewsServiceMock.deleteProductReview(anyString(), anything())).thenReturn(throwError(() => error));

      const action = deleteProductReview({ sku: '123', review });
      const completion = deleteProductReviewFail({
        error,
      });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });
      expect(effects.deleteProductReview$).toBeObservable(expected$);
    });
  });
});
