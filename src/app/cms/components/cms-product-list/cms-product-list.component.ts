import { ChangeDetectionStrategy, Component, OnChanges } from '@angular/core';

import { CMSComponentBase } from '../cms-component-base/cms-component-base';

@Component({
  selector: 'ish-cms-product-list',
  templateUrl: './cms-product-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSProductListComponent extends CMSComponentBase implements OnChanges {
  productSKUs: string[] = [];

  ngOnChanges() {
    this.productSKUs = this.pagelet.hasParam('Products')
      ? this.pagelet.configParam<string[]>('Products').map(product => product.split('@')[0])
      : [];
  }
}
