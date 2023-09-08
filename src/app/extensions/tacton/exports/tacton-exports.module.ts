import { NgModule } from '@angular/core';

import { EXTERNAL_DISPLAY_PROPERTY_PROVIDER } from 'ish-core/facades/product-context.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { loadFeatureProvider } from 'ish-core/utils/feature-toggle/feature-toggle.service';

import { LazyTactonConfigureProductComponent } from './lazy-tacton-configure-product/lazy-tacton-configure-product.component';
import { TactonProductContextDisplayPropertiesService } from './tacton-product-context-display-properties/tacton-product-context-display-properties.service';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    loadFeatureProvider('tacton', true, {
      location: () => import('../store/tacton-store.module').then(m => m.TactonStoreModule),
    }),
    {
      provide: EXTERNAL_DISPLAY_PROPERTY_PROVIDER,
      useClass: TactonProductContextDisplayPropertiesService,
      multi: true,
    },
  ],
  declarations: [LazyTactonConfigureProductComponent],
  exports: [LazyTactonConfigureProductComponent],
})
export class TactonExportsModule {}
