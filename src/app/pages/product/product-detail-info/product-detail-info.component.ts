import { ChangeDetectionStrategy, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable, map } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.helper';
import { TranslateModule } from '@ngx-translate/core';
import { RatingExportsModule } from '../../../extensions/rating/exports/rating-exports.module';
import { FeatureToggleModule } from '../../../core/feature-toggle.module';

import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { NgIf, AsyncPipe } from '@angular/common';
import { ProductAttachmentsComponent } from 'ish-shared/components/product/product-attachments/product-attachments.component';
import { ProductAttributesComponent } from 'ish-shared/components/product/product-attributes/product-attributes.component';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';

@Component({
  selector: 'ish-product-detail-info',
  templateUrl: './product-detail-info.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    NgbNavModule,
    FeatureToggleModule,
    RatingExportsModule,
    AsyncPipe,
    TranslateModule,
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
