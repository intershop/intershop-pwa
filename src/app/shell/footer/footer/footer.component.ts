import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, OnInit, PLATFORM_ID } from '@angular/core';
import { TransferState } from '@angular/platform-browser';

import { DISPLAY_VERSION } from 'ish-core/configurations/state-keys';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

/**
 * Footer Component
 * TODO: the content of the footer should probably come from the Intershop CMS for more comfortable management
 * - this might require changes to the positioning of the footer in the application shell
 * TODO: evaluate posibilities to resolve directives in 'ishServerHtml' content (like ngbCollapse, fa-icon)
 * - the whole 'collapsed' handling in the code is currently obsolete and not working with the content added via 'ishServerHtml'
 */
@Component({
  selector: 'ish-footer',
  templateUrl: './footer.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements OnInit, OnChanges {
  @Input() deviceType: DeviceType;

  appVersion: string;

  constructor(@Inject(PLATFORM_ID) private platformId: string, private transferState: TransferState) {}

  collapsed: boolean[] = [false, false, false, false, false, false];

  ngOnInit() {
    this.collapsed = this.collapsed.map(() => this.deviceType === 'mobile');

    if (isPlatformBrowser(this.platformId)) {
      this.appVersion = this.transferState.get(DISPLAY_VERSION, '');
    }
  }

  ngOnChanges() {
    this.collapsed = this.collapsed.map(() => this.deviceType === 'mobile');
  }
}
