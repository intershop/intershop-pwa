import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'contactUs',
        location: () => import('../store/contact-us-store.module').then(m => m.ContactUsStoreModule),
      },
      multi: true,
    },
  ],
  declarations: [],
  exports: [],
})
export class ContactUsExportsModule {}
