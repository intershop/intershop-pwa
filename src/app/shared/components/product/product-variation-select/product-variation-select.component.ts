import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

import { ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductVariationHelper } from 'ish-core/models/product-variation/product-variation.helper';
import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';

@Component({
  selector: 'ish-product-variation-select',
  templateUrl: './product-variation-select.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductVariationSelectComponent implements OnInit {
  uuid = uuid();
  variationOptions$: Observable<VariationOptionGroup[]>;
  visible$: Observable<boolean>;

  constructor(private context: ProductContextFacade) {}

  ngOnInit() {
    this.variationOptions$ = combineLatest([this.context.select('product'), this.context.select('variations')]).pipe(
      map(([product, variations]) => ProductVariationHelper.buildVariationOptionGroups(product, variations))
    );
    this.visible$ = this.context.select('displayProperties', 'variations');
  }

  optionChange(event: { group: string; value: string }) {
    this.context.changeVariationOption(event.group, event.value);
  }
}
