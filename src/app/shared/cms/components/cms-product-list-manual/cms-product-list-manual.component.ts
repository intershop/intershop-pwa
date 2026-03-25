import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Inject,
  Input,
  OnChanges,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { ProductsListComponent } from 'ish-shared/components/product/products-list/products-list.component';

@Component({
  selector: 'ish-cms-product-list-manual',
  templateUrl: './cms-product-list-manual.component.html',
  styleUrls: ['./cms-product-list-manual.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [NgClass, LoadingComponent, ProductsListComponent],
})
export class CMSProductListManualComponent implements CMSComponent, OnChanges {
  private static readonly FEATURED_PRODUCTS_PAGELET_PREFIX = 'pwa_featured_products';

  @Input({ required: true }) pagelet: ContentPageletView;

  productSKUs: string[] = [];
  showFeaturedProductsPlaceholder = false;

  private hidePlaceholderAnimationFrameId?: number;

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnChanges() {
    this.productSKUs = this.pagelet.hasParam('Products')
      ? this.pagelet.configParam<string[]>('Products').map(product => product.split('@')[0])
      : [];

    this.showFeaturedProductsPlaceholder = this.isFeaturedProductsPagelet;
    this.schedulePlaceholderHide();
  }

  get isFeaturedProductsPagelet(): boolean {
    return this.pagelet?.id?.startsWith(CMSProductListManualComponent.FEATURED_PRODUCTS_PAGELET_PREFIX);
  }

  private schedulePlaceholderHide() {
    if (!this.showFeaturedProductsPlaceholder || !isPlatformBrowser(this.platformId)) {
      return;
    }

    if (this.hidePlaceholderAnimationFrameId) {
      cancelAnimationFrame(this.hidePlaceholderAnimationFrameId);
    }

    this.hidePlaceholderAnimationFrameId = requestAnimationFrame(() => {
      this.hidePlaceholderAnimationFrameId = requestAnimationFrame(() => {
        this.showFeaturedProductsPlaceholder = false;
        this.cdRef.markForCheck();
      });
    });
  }
}
