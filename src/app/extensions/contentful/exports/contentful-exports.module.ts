import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'contentful',
        location: () => import('../store/contentful-store.module').then(m => m.ContentfulStoreModule),
      },
      multi: true,
    },
  ],
  declarations: [],
  exports: [],
})
export class ContentfulExportsModule {}
