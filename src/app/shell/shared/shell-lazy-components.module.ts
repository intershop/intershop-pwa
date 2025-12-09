import { NgModule } from '@angular/core';

import { LazyContentIncludeComponent } from './lazy-content-include/lazy-content-include.component';
import { LazyMiniBasketContentComponent } from './lazy-mini-basket-content/lazy-mini-basket-content.component';

/**
 * Module bundling generated shell lazy components to avoid circular imports.
 */
@NgModule({
  declarations: [LazyContentIncludeComponent, LazyMiniBasketContentComponent],
  exports: [LazyContentIncludeComponent, LazyMiniBasketContentComponent],
})
export class ShellLazyComponentsModule {}
