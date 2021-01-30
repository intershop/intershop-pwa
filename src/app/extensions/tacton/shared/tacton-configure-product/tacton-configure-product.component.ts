import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';

@Component({
  selector: 'ish-tacton-configure-product',
  templateUrl: './tacton-configure-product.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
@GenerateLazyComponent()
export class TactonConfigureProductComponent implements OnInit {
  @Input() displayType?: 'icon' | 'link' | 'list-button' = 'link';

  sku$: Observable<string>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.sku$ = this.context.select('product').pipe(map(product => product?.type === 'TactonProduct' && product?.sku));
  }
}
