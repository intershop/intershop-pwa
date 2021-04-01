import { ChangeDetectionStrategy, Component, OnInit, SkipSelf } from '@angular/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

@Component({
  selector: 'ish-product-master-link',
  templateUrl: './product-master-link.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ProductContextFacade],
})
export class ProductMasterLinkComponent implements OnInit {
  masterProductURL$: Observable<string>;
  visible$: Observable<boolean>;

  constructor(@SkipSelf() private parentContext: ProductContextFacade, private context: ProductContextFacade) {}

  ngOnInit() {
    this.context.connect('sku', this.parentContext.select('product', 'productMasterSKU'));
    this.visible$ = this.parentContext.select('displayProperties', 'variations');

    this.masterProductURL$ = this.context.select('productURL');
  }
}
