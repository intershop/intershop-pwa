import { ChangeDetectionStrategy, Component, OnInit, TransferState } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

import { DISPLAY_VERSION } from 'ish-core/configurations/state-keys';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { FeatureTogglePipe } from 'ish-core/pipes/feature-toggle.pipe';
import { ServerSettingPipe } from 'ish-core/pipes/server-setting.pipe';
import { ROLE_TOGGLE_IMPORTS } from 'ish-core/role-toggle';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';

import { CopilotComponent } from '../../../extensions/copilot/shared/copilot/copilot.component';

/**
 * Footer Component
 */
@Component({
  selector: 'ish-footer',
  imports: [
    ContentIncludeComponent,
    ...ROLE_TOGGLE_IMPORTS,
    ServerHtmlDirective,
    FeatureTogglePipe,
    ServerSettingPipe,
    CopilotComponent,
    RouterLink,
    TranslatePipe,
  ],
  standalone: true,
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit {
  appVersion: string;

  constructor(private transferState: TransferState) {}

  ngOnInit() {
    if (!SSR) {
      this.appVersion = this.transferState.get(DISPLAY_VERSION, '');
    }
  }
}
