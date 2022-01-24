import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { concatMap, filter, map, skip, withLatestFrom } from 'rxjs/operators';

import { ProductVariationHelper } from 'ish-core/models/product-variation/product-variation.helper';

import { AppFacade } from './app.facade';
import { ProductContextFacade } from './product-context.facade';
import { ShoppingFacade } from './shopping.facade';

@Injectable()
export class SelectedProductContextFacade extends ProductContextFacade {
  constructor(
    shoppingFacade: ShoppingFacade,
    translate: TranslateService,
    injector: Injector,
    private router: Router,
    private appFacade: AppFacade
  ) {
    super(shoppingFacade, translate, injector);
    this.set('requiredCompletenessLevel', () => true);
    this.connect('categoryId', shoppingFacade.selectedCategoryId$);
    this.connect('sku', shoppingFacade.selectedProductId$);

    this.connect(
      'sku',
      this.select('product').pipe(
        filter(ProductVariationHelper.hasDefaultVariation),
        concatMap(p =>
          this.appFacade.serverSetting$<boolean>('preferences.ChannelPreferences.EnableAdvancedVariationHandling').pipe(
            filter(advancedVariationHandling => advancedVariationHandling !== undefined && !advancedVariationHandling),
            map(() => p.defaultVariationSKU)
          )
        )
      )
    );

    this.hold(
      this.select('productURL').pipe(
        skip(1),
        withLatestFrom(this.appFacade.routingInProgress$),
        filter(([, progress]) => !progress)
      ),
      ([url]) => this.router.navigateByUrl(url)
    );
  }
}
