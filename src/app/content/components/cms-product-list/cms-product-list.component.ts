import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { ContentPageletView } from '../../../models/content-view/content-views';

// tslint:disable-next-line:project-structure
@Component({
  selector: 'ish-cms-product-list',
  templateUrl: './cms-product-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSProductListComponent implements OnChanges {
  @Input()
  pagelet: ContentPageletView;

  productSKUs: string[] = [];

  ngOnChanges() {
    if (!this.pagelet || !this.pagelet.hasParam('Products')) {
      this.productSKUs = [];
      return;
    }

    this.productSKUs = this.pagelet.configParam<string[]>('Products').map(product => product.split('@')[0]);
  }
}
