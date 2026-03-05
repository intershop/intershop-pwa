import { ChangeDetectionStrategy, Component, OnInit, TransferState } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

import { DISPLAY_VERSION } from 'ish-core/configurations/state-keys';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { FeatureTogglePipe } from 'ish-core/pipes/feature-toggle.pipe';
import { RoleToggleModule } from 'ish-core/role-toggle.module';
import { CMSModule } from 'ish-shared/cms/cms.module';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';

import { CopilotComponent } from '../../../extensions/copilot/shared/copilot/copilot.component';
import { StoreLocatorFooterComponent } from '../../../extensions/store-locator/shared/store-locator-footer/store-locator-footer.component';

/**
 * Footer Component
 */
@Component({
  selector: 'ish-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    CMSModule,
    ContentIncludeComponent,
    RoleToggleModule,
    ServerHtmlDirective,
    FeatureTogglePipe,
    CopilotComponent,
    StoreLocatorFooterComponent,
    TranslatePipe,
  ],
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
