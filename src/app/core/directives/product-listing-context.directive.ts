import { Directive, Input, OnChanges } from '@angular/core';

import { ProductListingContext, ProductListingContextFacade } from 'ish-core/facades/product-listing-context.facade';

@Directive({
  selector: '[ishProductListingContext]',
  providers: [ProductListingContextFacade],
})
export class ProductListingContextDirective implements OnChanges {
  @Input() fragmentOnRouting: ProductListingContext['fragmentOnRouting'];
  @Input() categoryId: ProductListingContext['categoryId'];
  @Input() mode: ProductListingContext['mode'] = 'endless-scrolling';
  @Input() type: ProductListingContext['type'];
  @Input() value: ProductListingContext['value'];
  @Input() viewType: ProductListingContext['viewType'];

  constructor(private context: ProductListingContextFacade) {}

  ngOnChanges() {
    this.context.set(state => ({
      ...state,
      categoryId: this.categoryId,
      type: this.type,
      value: this.value,
      fragmentOnRouting: this.fragmentOnRouting ?? state.fragmentOnRouting,
      mode: this.mode ?? state.mode,
      viewType: this.viewType ?? state.viewType,
    }));
  }
}
