import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { range } from 'lodash-es';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

/**
 * The Product Rating Component renders rating stars for a product with rounded average rating as number.
 */
@Component({
  selector: 'ish-product-rating',
  templateUrl: './product-rating.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductRatingComponent implements OnInit {
  stars$: Observable<('full' | 'half' | 'empty')[]>;
  rating$: Observable<number>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.rating$ = this.context.select('product', 'roundedAverageRating').pipe(filter(x => typeof x === 'number'));
    this.stars$ = this.rating$.pipe(
      map(rate => range(1, 6).map(index => (index <= rate ? 'full' : index - 0.5 === rate ? 'half' : 'empty')))
    );
  }
}
