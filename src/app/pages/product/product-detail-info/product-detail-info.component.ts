import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable, map } from 'rxjs';

import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { FEATURE_TOGGLE_IMPORTS } from 'ish-core/feature-toggle';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.helper';
import { ProductAttachmentsComponent } from 'ish-shared/components/product/product-attachments/product-attachments.component';
import { ProductAttributesComponent } from 'ish-shared/components/product/product-attributes/product-attributes.component';

import { ProductReviewsComponent } from '../../../extensions/rating/shared/product-reviews/product-reviews.component';

@Component({
  selector: 'ish-product-detail-info',
  templateUrl: './product-detail-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgbNavModule,
    ...FEATURE_TOGGLE_IMPORTS,
    ProductReviewsComponent,
    AsyncPipe,
    TranslatePipe,
    ProductAttachmentsComponent,
    ProductAttributesComponent,
    ServerHtmlDirective,
  ],
})
export class ProductDetailInfoComponent implements OnInit {
  product$: Observable<ProductView>;
  isVariationMaster$: Observable<boolean>;
  active = 'DESCRIPTION'; // default product tab

  private destroyRef = inject(DestroyRef);

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.product$ = this.context.select('product');

    // when routing between products reset the opened product tab to the default tab
    this.context
      .select('sku')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => (this.active = 'DESCRIPTION'));

    this.isVariationMaster$ = this.context.select('product').pipe(map(ProductHelper.isMasterProduct));
  }
}
