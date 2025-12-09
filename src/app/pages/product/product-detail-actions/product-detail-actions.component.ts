import { AsyncPipe, DOCUMENT, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { CompareExportsModule } from 'src/app/extensions/compare/exports/compare-exports.module';

import { ProductContextDisplayProperties, ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { ProductView } from 'ish-core/models/product-view/product-view.model';

import { WishlistsExportsModule } from '../../../extensions/wishlists/exports/wishlists-exports.module';

@Component({
  selector: 'ish-product-detail-actions',
  templateUrl: './product-detail-actions.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    FeatureToggleModule,
    WishlistsExportsModule,
    CompareExportsModule,
    FontAwesomeModule,
    AsyncPipe,
    TranslateModule,
  ],
})
export class ProductDetailActionsComponent implements OnInit {
  // TODO: to be removed once channelName information available in system
  channelName = 'inTRONICS';

  product$: Observable<ProductView>;

  constructor(
    @Inject(DOCUMENT) public document: Document,
    private context: ProductContextFacade
  ) {}

  ngOnInit() {
    this.product$ = this.context.select('product');
  }

  configuration$(key: keyof ProductContextDisplayProperties) {
    return this.context.select('displayProperties', key);
  }
}
