import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductHelper } from 'ish-core/models/product/product.helper';

@Component({
  selector: 'ish-product-item-variations',
  templateUrl: './product-item-variations.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductItemVariationsComponent implements OnInit {
  visible$: Observable<boolean>;
  readOnly$: Observable<boolean>;
  variationCount$: Observable<number>;
  isMasterProduct$: Observable<boolean>;
  isVariationProduct$: Observable<boolean>;

  constructor(private context: ProductContextFacade, private appFacade: AppFacade) {}

  ngOnInit() {
    this.visible$ = this.context.select('displayProperties', 'variations');

    const advancedVariationHandling$ = this.appFacade.serverSetting$<boolean>(
      'preferences.ChannelPreferences.EnableAdvancedVariationHandling'
    );
    this.readOnly$ = combineLatest([
      this.context.select('displayProperties', 'readOnly').pipe(startWith(false)),
      advancedVariationHandling$,
    ]).pipe(map(([readOnly, advancedVariationHandling]) => readOnly || advancedVariationHandling));

    this.isMasterProduct$ = this.context.select('product').pipe(map(ProductHelper.isMasterProduct));
    this.isVariationProduct$ = this.context.select('product').pipe(map(ProductHelper.isVariationProduct));

    this.variationCount$ = this.context.select('variationCount');
  }
}
