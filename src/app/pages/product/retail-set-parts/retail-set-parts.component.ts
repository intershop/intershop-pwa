import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { SkuQuantityType } from 'ish-core/models/product/product.model';

type DisplayType = 'tile' | 'row';

@Component({
  selector: 'ish-retail-set-parts',
  templateUrl: './retail-set-parts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RetailSetPartsComponent implements OnInit {
  @Input() displayType?: DisplayType = 'row';

  parts$: Observable<SkuQuantityType[]>;
  visible$: Observable<boolean>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.parts$ = this.context.select('parts');
    this.visible$ = this.context.select('displayProperties', 'retailSetParts');
  }
}
