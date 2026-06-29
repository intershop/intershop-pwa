import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';

/**
 * The Product ID Component renders the product id with a label.
 */
@Component({
  selector: 'ish-product-id',
  imports: [AsyncPipe, TranslatePipe],
  standalone: true,
  templateUrl: './product-id.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductIdComponent implements OnInit {
  visible$: Observable<boolean>;
  sku$: Observable<string>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.visible$ = this.context.select('displayProperties', 'sku');
    this.sku$ = this.context.select('product', 'sku');
  }
}
