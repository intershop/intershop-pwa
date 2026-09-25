import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { featureToggleGuard } from 'ish-core/feature-toggle.module';

const routes: Routes = [
  {
    path: 'copilot',
    loadChildren: () =>
      import('./copilot-embedded/copilot-embedded-page.module').then(m => m.CopilotEmbeddedPageModule),
    canActivate: [featureToggleGuard],
    data: {
      feature: 'copilotEmbedded',
      meta: {
        robots: 'noindex, nofollow',
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class CopilotEmbeddedRoutingModule {}
