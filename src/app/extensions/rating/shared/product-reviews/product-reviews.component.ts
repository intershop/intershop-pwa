import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { range } from 'lodash-es';
import { Observable, combineLatest, switchMap } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { NotRoleToggleDirective } from 'ish-core/directives/not-role-toggle.directive';
import { AccountFacade } from 'ish-core/facades/account.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ErrorMessageComponent } from 'ish-shared/components/common/error-message/error-message.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { ProductReviewsFacade } from '../../facades/product-reviews.facade';
import { ProductReview } from '../../models/product-reviews/product-review.model';
import { ProductRatingStarComponent, RatingFilledType } from '../product-rating-star/product-rating-star.component';
import { ProductReviewCreateDialogComponent } from '../product-review-create-dialog/product-review-create-dialog.component';

@Component({
  selector: 'ish-product-reviews',
  imports: [
    AsyncPipe,
    DatePipe,
    ErrorMessageComponent,
    LoadingComponent,
    ModalDialogComponent,
    NgTemplateOutlet,
    NotRoleToggleDirective,
    ProductRatingStarComponent,
    ProductReviewCreateDialogComponent,
    RouterLink,
    TranslatePipe,
  ],
  standalone: true,
  templateUrl: './product-reviews.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductReviewsComponent implements OnInit, OnDestroy {
  recentProductReviews$: Observable<ProductReview[]>;
  ownProductReview$: Observable<ProductReview>;

  error$: Observable<HttpError>;
  loading$: Observable<boolean>;
  isUserLoggedIn$: Observable<boolean>;

  private maxReviewItems = 10;

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
