import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

@Component({
  selector: 'ish-product-detail-variations',
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
