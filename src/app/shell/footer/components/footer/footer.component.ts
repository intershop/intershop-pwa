// NEEDS_WORK: DUMMY COMPONENT
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, Input, OnChanges, OnInit, PLATFORM_ID } from '@angular/core';
import { TransferState } from '@angular/platform-browser';

import { DISPLAY_VERSION } from 'ish-core/configurations/state-keys';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

/**
 * Footer Component
 * TODO: the content of the footer needs to come from the Intershop CMS
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
