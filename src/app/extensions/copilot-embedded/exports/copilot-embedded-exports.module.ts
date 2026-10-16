import { NgModule } from '@angular/core';

import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { LazyCopilotEmbeddedLinkComponent } from './lazy-copilot-embedded-link/lazy-copilot-embedded-link.component';

@NgModule({
  declarations: [LazyCopilotEmbeddedLinkComponent],
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
  exports: [LazyCopilotEmbeddedLinkComponent],
})
export class CopilotEmbeddedExportsModule {}
