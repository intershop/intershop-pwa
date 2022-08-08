import { Directive, Input, OnInit, Optional, Output, SkipSelf } from '@angular/core';
import { ReplaySubject, combineLatest, debounceTime, distinctUntilChanged, pairwise, startWith } from 'rxjs';

import {
  ProductContext,
  ProductContextDisplayProperties,
  ProductContextFacade,
} from 'ish-core/facades/product-context.facade';
import { ProductCompletenessLevel, SkuQuantityType } from 'ish-core/models/product/product.model';

declare type IdType = number | string;

@Directive({
  selector: '[ishProductContext]',
  providers: [ProductContextFacade],
  exportAs: 'ishProductContext',
})
export class ProductContextDirective implements OnInit {
  @Input() completeness: 'List' | 'Detail' = 'List';
  @Output() skuChange = this.context.select('sku');
  @Output() quantityChange = this.context.select('quantity');

  private propIndex$ = new ReplaySubject<IdType>(1);

  constructor(@SkipSelf() @Optional() parentContext: ProductContextFacade, private context: ProductContextFacade) {
    if (parentContext) {
      function removeFromParent(parent: ProductContext['children'], id: IdType) {
        delete parent[id];
      }

      function addToParent(parent: ProductContext['children'], id: IdType, context: ProductContext) {
        parent[id] = context;
      }

      function isId(id: IdType): boolean {
        return id !== undefined;
      }

      parentContext.connect(
        'children',
        combineLatest([
          this.propIndex$.pipe(startWith(undefined), distinctUntilChanged(), pairwise()),
          this.context.select().pipe(debounceTime(0)),
        ]),
        (parent, [[prevId, currId], context]) => {
          let newChildren: ProductContext['children'];

          // remove previous entry if ID changed
          if (context.propagateActive && isId(prevId) && prevId !== currId) {
            newChildren = { ...parent.children };
            removeFromParent(newChildren, prevId);
          }

          // propagate current entry
          if (isId(currId)) {
            newChildren ??= { ...parent.children };
            if (context.propagateActive) {
              addToParent(newChildren, currId, context);
            } else {
              removeFromParent(newChildren, currId);
            }
          }

          return newChildren ?? parent.children;
        }
      );
    }
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
  set propagateIndex(index: number | string) {
    this.propIndex$.next(index);
  }

  @Input()
  set parts(parts: SkuQuantityType[]) {
    this.context.set('parts', () => parts);
  }

  @Input()
  set configuration(config: Partial<ProductContextDisplayProperties>) {
    this.context.config = config;
  }

  ngOnInit() {
    this.context.set('requiredCompletenessLevel', () =>
      this.completeness === 'List' ? ProductCompletenessLevel.List : ProductCompletenessLevel.Detail
    );
  }
}
