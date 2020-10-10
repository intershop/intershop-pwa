import { Injectable, Injector } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';

import { ProductContextFacade } from './product-context.facade';
import { ShoppingFacade } from './shopping.facade';

@Injectable()
export class SelectedProductContextFacade extends ProductContextFacade {
  constructor(shoppingFacade: ShoppingFacade, translate: TranslateService, injector: Injector) {
    super(shoppingFacade, translate, injector);
    this.set('requiredCompletenessLevel', () => ProductCompletenessLevel.Detail);
    this.connect('sku', shoppingFacade.selectedProductId$);
  }
}
