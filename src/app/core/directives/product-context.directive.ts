import {
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  SimpleChanges,
  SkipSelf,
} from '@angular/core';

import { ProductContextDisplayProperties, ProductContextFacade } from 'ish-core/facades/product-context.facade';
import { ProductCompletenessLevel, SkuQuantityType } from 'ish-core/models/product/product.model';

@Directive({
  selector: '[ishProductContext]',
  providers: [ProductContextFacade],
})
export class ProductContextDirective implements OnInit, OnChanges, OnDestroy {
  @Input() completeness: 'List' | 'Detail' = 'List';
  @Input() propagateIndex: number;

  @Output() skuChange = this.context.select('sku');
  @Output() quantityChange = this.context.select('quantity');

  constructor(
    @SkipSelf() @Optional() private parentContext: ProductContextFacade,
    private context: ProductContextFacade
  ) {
    this.context.hold(this.context.$, () => this.propagate());
  }

  @Input()
  set log(log: boolean) {
    this.context.log(log);
  }

  @Input()
  set sku(sku: string) {
    this.context.set('sku', () => sku);
  }

  @Input()
  set categoryId(categoryId: string) {
    this.context.set('categoryId', () => categoryId);
  }

  @Input()
  set quantity(quantity: number) {
    this.context.set('quantity', () => quantity);
  }

  @Input()
  set allowZeroQuantity(allowZeroQuantity: boolean) {
    this.context.set('allowZeroQuantity', () => allowZeroQuantity);
  }

  @Input()
  set propagateActive(propagateActive: boolean) {
    this.context.set('propagateActive', () => propagateActive);
  }

  @Input()
  set parts(parts: SkuQuantityType[]) {
    this.context.set('parts', () => parts);
    this.context.set('displayProperties', () => ({
      readOnly: true,
      addToBasket: true,
    }));
  }

  @Input()
  set configuration(config: Partial<ProductContextDisplayProperties>) {
    this.context.config = config;
  }

  private propagate(remove = false) {
    if (this.propagateIndex !== undefined) {
      if (!this.parentContext) {
        throw new Error('cannot propagate without parent context');
      }
      this.parentContext.propagate(
        this.propagateIndex,
        this.context.get('propagateActive') && !remove ? this.context.get() : undefined
      );
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes?.propagateActive) {
      this.propagate();
    }
  }

  ngOnInit() {
    this.context.set('requiredCompletenessLevel', () =>
      this.completeness === 'List' ? ProductCompletenessLevel.List : ProductCompletenessLevel.Detail
    );
  }

  ngOnDestroy(): void {
    this.propagate(true);
  }
}
