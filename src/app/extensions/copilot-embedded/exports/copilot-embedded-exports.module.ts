import { NgModule } from '@angular/core';

import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

@NgModule({
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'copilotEmbedded',
        location: () => import('../store/copilot-embedded-store.module').then(m => m.CopilotEmbeddedStoreModule),
      },
      multi: true,
    },
  ],
})
export class CopilotEmbeddedExportsModule {}
