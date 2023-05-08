import { NgModule } from '@angular/core';

import { loadFeatureProvider } from 'ish-core/utils/feature-toggle/feature-toggle.service';

@NgModule({
  providers: [
    loadFeatureProvider('always', true, {
      location: () => import('../store/seo-store.module').then(m => m.SeoStoreModule),
    }),
  ],
})
export class SeoExportsModule {}
