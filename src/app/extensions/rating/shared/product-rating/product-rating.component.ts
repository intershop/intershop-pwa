import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductHelper } from 'ish-core/models/product/product.helper';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

/**
 * The Product Rating Component renders rating stars for a product (besides variation masters) with rounded average rating as number. *
 */
@Component({
  selector: 'ish-product-rating',
  standalone: false,
  templateUrl: './product-rating.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class ProductRatingComponent implements OnInit {
  @Input() hideNumberOfReviews = false;

  rating$: Observable<{ value: number }>;
  numberOfReviews$: Observable<number>;
  isVariationMaster$: Observable<boolean>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.rating$ = this.context.select('product', 'roundedAverageRating').pipe(map(r => ({ value: r ?? 0 })));
    this.numberOfReviews$ = this.context.select('product', 'numberOfReviews');
    this.isVariationMaster$ = this.context.select('product').pipe(map(ProductHelper.isMasterProduct));
  }
}
