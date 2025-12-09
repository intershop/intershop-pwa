import { ChangeDetectionStrategy, Component, OnInit, TransferState } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { DISPLAY_VERSION } from 'ish-core/configurations/state-keys';
import { ServerHtmlDirective } from 'ish-core/directives/server-html.directive';
import { RoleToggleModule } from 'ish-core/role-toggle.module';
import { CMSModule } from 'ish-shared/cms/cms.module';
import { ShellLazyComponentsModule } from 'ish-shell/shared/shell-lazy-components.module';

import { StoreLocatorExportsModule } from '../../../extensions/store-locator/exports/store-locator-exports.module';

/**
 * Footer Component
 */
@Component({
  selector: 'ish-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CMSModule, RoleToggleModule, ServerHtmlDirective, ShellLazyComponentsModule, StoreLocatorExportsModule, TranslateModule],
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
