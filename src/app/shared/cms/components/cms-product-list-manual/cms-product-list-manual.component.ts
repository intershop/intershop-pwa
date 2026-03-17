import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';
import { ProductsListComponent } from 'ish-shared/components/product/products-list/products-list.component';

@Component({
  selector: 'ish-cms-product-list-manual',
  templateUrl: './cms-product-list-manual.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [ NgClass, ProductsListComponent],
})
export class CMSProductListManualComponent implements CMSComponent, OnChanges {
  @Input({ required: true }) pagelet: ContentPageletView;

  productSKUs: string[] = [];

  ngOnChanges() {
    this.productSKUs = this.pagelet.hasParam('Products')
      ? this.pagelet.configParam<string[]>('Products').map(product => product.split('@')[0])
      : [];
  }
}
