import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';
import { checkDisplayType } from 'ish-shared/components/product/product-item/product-item.util';

@Component({
  selector: 'ish-cms-product-list-manual',
  templateUrl: './cms-product-list-manual.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSProductListManualComponent implements CMSComponent, OnChanges {
  @Input() pagelet: ContentPageletView;

  productSKUs: string[] = [];

  checkDisplayType = checkDisplayType;

  ngOnChanges() {
    this.productSKUs = this.pagelet.hasParam('Products')
      ? this.pagelet.configParam<string[]>('Products').map(product => product.split('@')[0])
      : [];
  }
}
