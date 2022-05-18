import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { range } from 'lodash-es';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductReview } from 'ish-core/models/product-reviews/product-review.model';

@Component({
  selector: 'ish-product-reviews',
  templateUrl: './product-reviews.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductReviewsComponent implements OnInit {
  productReviews$: Observable<ProductReview[]>;
  stars$: Observable<('full' | 'half' | 'empty')[]>;
  rating$: Observable<number>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.productReviews$ = this.context.select('reviews');
    this.rating$ = this.context.select('product', 'roundedAverageRating').pipe(filter(x => typeof x === 'number'));
    this.stars$ = this.rating$.pipe(
      map(rate => range(1, 6).map(index => (index <= rate ? 'full' : index - 0.5 === rate ? 'half' : 'empty')))
    );
  }
}
