import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { ProductVariationDisplayComponent } from 'ish-shared/components/product/product-variation-display/product-variation-display.component';
import { ProductVariationSelectComponent } from 'ish-shared/components/product/product-variation-select/product-variation-select.component';

import { ProductMasterLinkComponent } from '../product-master-link/product-master-link.component';

@Component({
  selector: 'ish-product-detail-variations',
  imports: [
    AsyncPipe,
    ProductMasterLinkComponent,
    ProductVariationDisplayComponent,
    ProductVariationSelectComponent,
    ServerSettingPipe,
  ],
  standalone: true,
  templateUrl: './product-detail-variations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductDetailVariationsComponent implements OnInit {
  visible$: Observable<boolean>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.visible$ = this.context.select('displayProperties', 'variations');
  }
}
