import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { range } from 'lodash-es';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

/**
 * The Product Rating Component renders rating stars for a product (besides variation masters) with rounded average rating as number. *
 */
@Component({
  selector: 'ish-product-rating',
  templateUrl: './product-rating.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class ProductRatingComponent implements OnInit {
  @Input() hideNumberOfReviews = false;

  stars$: Observable<('full' | 'half' | 'empty')[]>;
  rating$: Observable<number>;
  numberOfReviews$: Observable<number>;
  isVariationMaster$: Observable<boolean>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.rating$ = this.context.select('product', 'roundedAverageRating').pipe(filter(x => typeof x === 'number'));
    this.stars$ = this.rating$.pipe(
      map(rate => range(1, 6).map(index => (index <= rate ? 'full' : index - 0.5 === rate ? 'half' : 'empty')))
    );
    this.numberOfReviews$ = this.context.select('product', 'numberOfReviews');
    this.isVariationMaster$ = this.context.select('variationCount').pipe(map(variationCount => !!variationCount));
  }
}
