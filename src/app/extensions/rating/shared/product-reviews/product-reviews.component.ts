import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { range } from 'lodash-es';
import { Observable, combineLatest, switchMap } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { ProductReviewsFacade } from '../../facades/product-reviews.facade';
import { ProductReview } from '../../models/product-reviews/product-review.model';
import { RatingFilledType } from '../product-rating-star/product-rating-star.component';

@Component({
  selector: 'ish-product-reviews',
  templateUrl: './product-reviews.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class ProductReviewsComponent implements OnInit, OnDestroy {
  recentProductReviews$: Observable<ProductReview[]>;
  ownProductReview$: Observable<ProductReview>;

  error$: Observable<HttpError>;
  loading$: Observable<boolean>;
  isUserLoggedIn$: Observable<boolean>;

  maxReviewItems = 10;

  constructor(
    private accountFacade: AccountFacade,
    private context: ProductContextFacade,
    private productReviewsFacade: ProductReviewsFacade
  ) {}

  ngOnInit() {
    const sku$ = this.context.select('sku').pipe(shareReplay(1));
    this.isUserLoggedIn$ = this.accountFacade.isLoggedIn$;

    const productReviews$ = combineLatest([sku$, this.isUserLoggedIn$]).pipe(
      switchMap(([sku]) => this.productReviewsFacade.getProductReviews$(sku)),
      shareReplay(1)
    );

    this.recentProductReviews$ = productReviews$.pipe(
      map(reviews => reviews?.filter(review => !review.own)),
      map(reviews => reviews?.slice(0, this.maxReviewItems))
    );
    this.ownProductReview$ = productReviews$.pipe(map(reviews => reviews?.find(review => review.own)));

    this.error$ = this.productReviewsFacade.productReviewsError$;
    this.loading$ = this.productReviewsFacade.productReviewsLoading$;
  }

  getStars(rating: number): RatingFilledType[] {
    return range(1, 6).map(index => (index <= rating ? 'full' : 'empty'));
  }

  deleteReview(review: ProductReview) {
    this.productReviewsFacade.deleteProductReview(this.context.get('sku'), review);
  }

  ngOnDestroy() {
    this.productReviewsFacade.resetProductReviewError();
  }
}
