import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from 'ish-shared/shared.module';

import { CopilotEmbeddedChatComponent } from './copilot-embedded-chat/copilot-embedded-chat.component';
import { CopilotEmbeddedChoicesComponent } from './copilot-embedded-choices/copilot-embedded-choices.component';
import { CopilotEmbeddedHeaderComponent } from './copilot-embedded-header/copilot-embedded-header.component';
import { CopilotEmbeddedInputComponent } from './copilot-embedded-input/copilot-embedded-input.component';
import { CopilotEmbeddedMessagesComponent } from './copilot-embedded-messages/copilot-embedded-messages.component';
import { CopilotEmbeddedPageComponent } from './copilot-embedded-page.component';
import { CopilotEmbeddedResultsComponent } from './copilot-embedded-results/copilot-embedded-results.component';

const copilotEmbeddedPageRoutes: Routes = [{ path: '', component: CopilotEmbeddedPageComponent }];

@NgModule({
  imports: [NgbNavModule, RouterModule.forChild(copilotEmbeddedPageRoutes), SharedModule],
  declarations: [
    CopilotEmbeddedChatComponent,
    CopilotEmbeddedChoicesComponent,
    CopilotEmbeddedHeaderComponent,
    CopilotEmbeddedInputComponent,
    CopilotEmbeddedMessagesComponent,
    CopilotEmbeddedPageComponent,
    CopilotEmbeddedResultsComponent,
  ],
})
export class CopilotEmbeddedPageModule {}
