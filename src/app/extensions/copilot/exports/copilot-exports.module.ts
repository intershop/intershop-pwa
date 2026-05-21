import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { LazyCopilotComponent } from './lazy-copilot/lazy-copilot.component';

@NgModule({
  declarations: [LazyCopilotComponent],
  imports: [FeatureToggleModule],
  exports: [LazyCopilotComponent],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: {
        feature: 'copilot',
        location: () => import('../store/copilot-store.module').then(m => m.CopilotStoreModule),
      },
      multi: true,
    },
  ],
})
export class CopilotExportsModule {}
