import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { range } from 'lodash-es';
import { Observable } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

import { ProductReviewsFacade } from '../../facades/product-reviews.facade';
import { ProductReview } from '../../models/product-reviews/product-review.model';

@Component({
  selector: 'ish-product-reviews',
  templateUrl: './product-reviews.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class ProductReviewsComponent implements OnInit {
  productReviews$: Observable<ProductReview[]>;
  stars$: Observable<('full' | 'half' | 'empty')[]>;
  rating$: Observable<number>;
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;

  constructor(private context: ProductContextFacade, private productReviewsFacade: ProductReviewsFacade) {}

  ngOnInit() {
    this.productReviews$ = this.context
      .select('product', 'sku')
      .pipe(switchMap(sku => this.productReviewsFacade.getProductReviews$(sku)));
    this.rating$ = this.context.select('product', 'roundedAverageRating').pipe(filter(x => typeof x === 'number'));
    this.stars$ = this.rating$.pipe(
      map(rate => range(1, 6).map(index => (index <= rate ? 'full' : index - 0.5 === rate ? 'half' : 'empty')))
    );
    this.error$ = this.productReviewsFacade.productReviewsError$;
    this.loading$ = this.productReviewsFacade.productReviewsLoading$;
  }
}
