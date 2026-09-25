import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from 'ish-shared/shared.module';

import { CopilotEmbeddedChatComponent } from './copilot-embedded-chat/copilot-embedded-chat.component';
import { CopilotEmbeddedHeaderComponent } from './copilot-embedded-header/copilot-embedded-header.component';
import { CopilotEmbeddedPageComponent } from './copilot-embedded-page.component';
import { CopilotEmbeddedResultsComponent } from './copilot-embedded-results/copilot-embedded-results.component';

const copilotEmbeddedPageRoutes: Routes = [{ path: '', component: CopilotEmbeddedPageComponent }];

@NgModule({
  imports: [NgbNavModule, RouterModule.forChild(copilotEmbeddedPageRoutes), SharedModule],
  declarations: [
    CopilotEmbeddedChatComponent,
    CopilotEmbeddedHeaderComponent,
    CopilotEmbeddedPageComponent,
    CopilotEmbeddedResultsComponent,
  ],
})
export class CopilotEmbeddedPageModule {}
