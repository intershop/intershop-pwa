import { ChangeDetectionStrategy, Component, DoCheck, Input } from '@angular/core';

import { ContentPageletView } from '../../../models/content-view/content-views';

@Component({
  selector: 'ish-cms-product-list',
  templateUrl: './cms-product-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSProductListComponent implements DoCheck {
  @Input()
  pagelet: ContentPageletView;

  productSKUs: string[] = [];

  private initialized: boolean;

  ngDoCheck() {
    if (!this.initialized && this.pagelet) {
      this.productSKUs = this.pagelet.hasParam('Products')
        ? this.pagelet.configParam<string[]>('Products').map(product => product.split('@')[0])
        : [];
    }
  }
}
