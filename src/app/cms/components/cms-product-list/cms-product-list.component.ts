import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { ContentPageletView } from 'ish-core/models/content-view/content-views';
import { SfeMetadataWrapper } from '../../../cms/sfe-adapter/sfe-metadata-wrapper';

@Component({
  selector: 'ish-cms-product-list',
  templateUrl: './cms-product-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSProductListComponent extends SfeMetadataWrapper implements OnChanges {
  @Input() pagelet: ContentPageletView;
  productSKUs: string[] = [];

  ngOnChanges() {
    this.productSKUs = this.pagelet.hasParam('Products')
      ? this.pagelet.configParam<string[]>('Products').map(product => product.split('@')[0])
      : [];
  }
}
