import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { CopilotEmbeddedContext, CopilotEmbeddedContextFacade } from '../../facades/copilot-embedded-context.facade';

/**
 * The Copilot Embedded page lays out the chat and results components.
 */
@Component({
  selector: 'ish-copilot-embedded-page',
  standalone: false,
  templateUrl: './copilot-embedded-page.component.html',
  styleUrls: ['./copilot-embedded-page.component.scss'],
  providers: [CopilotEmbeddedContextFacade],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CopilotEmbeddedPageComponent {
  deviceType$: Observable<DeviceType> = this.appFacade.deviceType$;
  context$: Observable<CopilotEmbeddedContext> = this.context.select();

  activeNavId = 'chat';

  constructor(
    private appFacade: AppFacade,
    private context: CopilotEmbeddedContextFacade
  ) {}

  resetSession() {
    this.context.reset();
  }
}
