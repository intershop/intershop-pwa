import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductMasterLinkComponent } from '../product-master-link/product-master-link.component';
import { NgIf, AsyncPipe } from '@angular/common';
import { ProductVariationDisplayComponent } from 'ish-shared/components/product/product-variation-display/product-variation-display.component';
import { ProductVariationSelectComponent } from 'ish-shared/components/product/product-variation-select/product-variation-select.component';
import { ServerSettingPipe } from '../../../core/pipes/server-setting.pipe';

@Component({
  selector: 'ish-product-detail-variations',
  templateUrl: './product-detail-variations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    ProductMasterLinkComponent,
    AsyncPipe,
    ServerSettingPipe,
    ProductVariationDisplayComponent,
    ProductVariationSelectComponent,
  ],
})
export class ProductDetailVariationsComponent implements OnInit {
  visible$: Observable<boolean>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.visible$ = this.context.select('displayProperties', 'variations');
  }
}
