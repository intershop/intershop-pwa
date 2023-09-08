import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { loadFeatureProvider } from 'ish-core/utils/feature-toggle/feature-toggle.service';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    loadFeatureProvider('contactUs', true, {
      location: () => import('../store/contact-us-store.module').then(m => m.ContactUsStoreModule),
    }),
  ],
  declarations: [],
  exports: [],
})
export class ContactUsExportsModule {}
