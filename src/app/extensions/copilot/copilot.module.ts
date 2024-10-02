import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CopilotComponent } from './copilot.component';
import { CopilotExportsModule } from './exports/copilot-exports.module';
import { CopilotFacade } from './facades/copilot.facade';
import { CopilotRoutingModule } from './pages/copilot-routing.module';

@NgModule({
  declarations: [CopilotComponent],
  imports: [CommonModule, CopilotExportsModule, CopilotRoutingModule],
  providers: [CopilotFacade],
  exports: [CopilotComponent],
})
export class CopilotModule {}
