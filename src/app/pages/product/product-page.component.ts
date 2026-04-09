import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { SelectedProductContextFacade } from 'ish-core/facades/selected-product-context.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { FeatureTogglePipe } from 'ish-core/pipes/feature-toggle.pipe';
import { BreadcrumbComponent } from 'ish-shared/components/common/breadcrumb/breadcrumb.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';

import { RecentlyViewedComponent } from '../../extensions/recently/shared/recently-viewed/recently-viewed.component';

import { ProductBundlePartsComponent } from './product-bundle-parts/product-bundle-parts.component';
import { ProductDetailInfoComponent } from './product-detail-info/product-detail-info.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductLinksComponent } from './product-links/product-links.component';
import { ProductMasterVariationsComponent } from './product-master-variations/product-master-variations.component';
import { RetailSetPartsComponent } from './retail-set-parts/retail-set-parts.component';

@Component({
  selector: 'ish-product-page',
  templateUrl: './product-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: ProductContextFacade, useClass: SelectedProductContextFacade }],
  standalone: true,
  imports: [
    BreadcrumbComponent,
    LoadingComponent,
    ProductDetailComponent,
    ProductBundlePartsComponent,
    RetailSetPartsComponent,
    ProductDetailInfoComponent,
    ProductMasterVariationsComponent,
    ProductLinksComponent,
    RecentlyViewedComponent,
    FeatureTogglePipe,
    AsyncPipe,
  ],
})
export class ProductPageComponent implements OnInit {
  productLoading$: Observable<boolean>;
  product$: Observable<ProductView>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.productLoading$ = this.context.select('loading');
    this.product$ = this.context.select('product');
  }
}
