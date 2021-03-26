import { NgModule } from '@angular/core';

import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

@NgModule({
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'always',
        location: () => import('../store/seo-store.module').then(m => m.SeoStoreModule),
      },
      multi: true,
    },
  ],
})
export class SeoExportsModule {}
