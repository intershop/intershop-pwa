import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CopilotEmbeddedLinkComponent } from './shared/copilot-embedded-link/copilot-embedded-link.component';

@NgModule({
  imports: [SharedModule],
  declarations: [CopilotEmbeddedLinkComponent],
})
export class CopilotEmbeddedModule {}
