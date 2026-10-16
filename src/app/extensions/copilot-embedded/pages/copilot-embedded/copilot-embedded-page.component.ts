import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { CopilotEmbeddedContext, CopilotEmbeddedContextFacade } from '../../facades/copilot-embedded-context.facade';

/**
 * The Copilot Embedded page lays out the chat and results components.
 * The conversation state is held by the {@link CopilotEmbeddedContextFacade}.
 */
@Component({
  selector: 'ish-copilot-embedded-page',
  standalone: false,
  templateUrl: './copilot-embedded-page.component.html',
  styleUrls: ['./copilot-embedded-page.component.scss'],
  providers: [CopilotEmbeddedContextFacade],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopilotEmbeddedPageComponent implements OnInit {
  deviceType$: Observable<DeviceType>;
  context$: Observable<CopilotEmbeddedContext>;

  activeNavId = 'chat';

  constructor(
    private appFacade: AppFacade,
    private context: CopilotEmbeddedContextFacade
  ) {}

  ngOnInit() {
    this.deviceType$ = this.appFacade.deviceType$;
    this.context$ = this.context.select();
  }

  resetSession() {
    this.context.reset();
  }
}
