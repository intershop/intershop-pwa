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

  ngDoCheck() {
    if (!this.pagelet || !this.pagelet.hasParam('Products')) {
      this.productSKUs = [];
      return;
    }

    this.productSKUs = this.pagelet.configParam<string[]>('Products').map(product => product.split('@')[0]);
  }
}
